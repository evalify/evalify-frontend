import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";
import { decode, JwtPayload } from "jsonwebtoken";

interface KeycloakToken {
  access_token: string;
  refresh_token?: string;
  expires_at: number;
  groups: string[];
  idToken?: string;
  error?: string;
}

interface DecodedJWT {
  realm_access?: {
    roles?: string[];
  };
  groups?: string[];
  [key: string]: unknown;
}

function processDecodedToken(decoded: string | JwtPayload | null): {
  roles: string[];
  groups: string[];
} {
  let roles: string[] = [];
  let groups: string[] = [];

  // Only process if decoded is an object (JwtPayload) and not null or string
  if (decoded && typeof decoded === "object" && !Array.isArray(decoded)) {
    const decodedJWT = decoded as DecodedJWT;
    roles = decodedJWT.realm_access?.roles || [];
    groups = (decodedJWT.groups || []).map((group: string) =>
      group.replace(/^\//, ""),
    );
  }
  return { roles, groups };
}

async function refreshKeycloakAccessToken(token: KeycloakToken) {
  try {
    console.log("Attempting to refresh Keycloak access token...");

    const response = await fetch(
      `${process.env.AUTH_KEYCLOAK_ISSUER!}/protocol/openid-connect/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: token.refresh_token!,
          client_id: process.env.AUTH_KEYCLOAK_ID!,
          client_secret: process.env.AUTH_KEYCLOAK_SECRET!,
        }),
      },
    );

    const refreshedTokens = await response.json();

    if (!response.ok) {
      console.error("Failed to refresh access token:", {
        status: response.status,
        statusText: response.statusText,
        error: refreshedTokens,
      });
      throw new Error(
        `Token refresh failed: ${
          refreshedTokens.error_description ||
          refreshedTokens.error ||
          "Unknown error"
        }`,
      );
    }

    const decoded = decode(refreshedTokens.access_token);
    const { roles, groups } = processDecodedToken(decoded);

    console.log("Successfully refreshed access token");
    return {
      ...token,
      access_token: refreshedTokens.access_token,
      refresh_token: refreshedTokens.refresh_token ?? token.refresh_token,
      expires_at: Math.floor(Date.now() / 1000) + refreshedTokens.expires_in,
      roles: roles,
      groups: groups,
      error: null,
    };
  } catch (error: unknown) {
    console.error("Error refreshing access token:", error);

    let errorMessage = "RefreshAccessTokenError";
    if (error instanceof Error) {
      errorMessage = `RefreshAccessTokenError: ${error.message}`;
    }

    return {
      ...token,
      error: errorMessage,
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Keycloak({
      clientId: process.env.AUTH_KEYCLOAK_ID,
      clientSecret: process.env.AUTH_KEYCLOAK_SECRET,
      issuer: process.env.AUTH_KEYCLOAK_ISSUER,
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, user }) {
      // Initial sign in
      if (account && user) {
        const decoded = decode(account.access_token!);
        const { roles, groups } = processDecodedToken(decoded);
        return {
          ...token,
          access_token: account.access_token,
          refresh_token: account.refresh_token,
          expires_at: account.expires_at,
          roles: roles,
          groups: groups,
          id: user.id, // or account.providerAccountId if user.id is not available directly
        };
      }
      // Return previous token if the access token has not expired yet
      // Add a small buffer (e.g., 60 seconds) to proactively refresh
      if (
        token.expires_at &&
        Date.now() < token.expires_at * 1000 - 60 * 1000
      ) {
        return token;
      }

      // Access token has expired or is about to expire, try to update it
      if (token.refresh_token) {
        return refreshKeycloakAccessToken(token as KeycloakToken);
      }

      // If no refresh token, return the token as is (it might be an error state or session ended)
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string; // Ensure id is correctly assigned
        session.user.roles = token.roles as string[];
        session.user.groups = token.groups as string[];
        session.access_token = token.access_token as string;
        if (token.error) {
          session.error = token.error as string;
        }
      }
      return session;
    },
  },
});
