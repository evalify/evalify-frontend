import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";
import { decode, JwtPayload } from "jsonwebtoken";

interface KeycloakToken {
  access_token: string;
  refresh_token?: string;
  expires_at: number;
  session_expires_at?: number;
  groups: string[];
  roles?: string[];
  id_token?: string;
  error?: string;
  id?: string;
  [key: string]: unknown;
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
  if (decoded && typeof decoded === "object" && !Array.isArray(decoded)) {
    const decodedJWT = decoded as DecodedJWT;
    roles = decodedJWT.realm_access?.roles || [];
    groups = (decodedJWT.groups || []).map((group: string) =>
      group.replace(/^\//, ""),
    );
  }
  return { roles, groups };
}

async function refreshKeycloakAccessToken(
  token: KeycloakToken,
): Promise<KeycloakToken | null> {
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
      // If session is not active, return null to invalidate the session gracefully
      if (
        refreshedTokens.error === "invalid_grant" &&
        refreshedTokens.error_description === "Session not active"
      ) {
        console.log("Session has expired, invalidating session");
        return null;
      }

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
      id_token: refreshedTokens.id_token ?? token.id_token,
      error: undefined,
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
      authorization: {
        params: {
          prompt: "login",
          max_age: "0",
        },
      },
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
      // Initial sign-in
      if (account && user) {
        const decoded = decode(account.access_token!);
        const { roles, groups } = processDecodedToken(decoded);
        // Calculate session expiry based on Keycloak's refresh token expiry
        const refreshExpiresIn =
          typeof account.refresh_expires_in === "number"
            ? account.refresh_expires_in
            : 600;
        const sessionExpiresAt =
          Math.floor(Date.now() / 1000) + refreshExpiresIn;
        return {
          ...token,
          access_token: account.access_token,
          refresh_token: account.refresh_token,
          id_token: account.id_token,
          expires_at: account.expires_at,
          session_expires_at: sessionExpiresAt,
          roles: roles,
          groups: groups,
          id: user.id,
        };
      }
      if (
        token.session_expires_at &&
        typeof token.session_expires_at === "number" &&
        Date.now() > token.session_expires_at * 1000
      ) {
        console.log(
          "Session has expired based on Keycloak refresh token expiry",
        );
        return null;
      }

      // Token still valid
      if (
        token.expires_at &&
        Date.now() < token.expires_at * 1000 - 15 * 1000
      ) {
        return token;
      } // Try to refresh
      if (token.refresh_token) {
        const refreshedToken = await refreshKeycloakAccessToken(
          token as KeycloakToken,
        );
        // If refresh returns null (session expired), invalidate the session
        if (!refreshedToken) {
          return null;
        }
        return refreshedToken;
      }

      // No refresh token or refresh failed — invalidate session
      return null;
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
  events: {
    async signOut(message) {
      if ("token" in message && message.token?.id_token) {
        try {
          const issuerUrl = process.env.AUTH_KEYCLOAK_ISSUER;
          const logoutUrl = new URL(
            `${issuerUrl}/protocol/openid-connect/logout`,
          );
          logoutUrl.searchParams.set(
            "id_token_hint",
            message.token.id_token as string,
          );
          logoutUrl.searchParams.set(
            "client_id",
            process.env.AUTH_KEYCLOAK_ID!,
          );

          const response = await fetch(logoutUrl, { method: "GET" });
          if (response.ok) {
            console.log("Keycloak session terminated successfully");
          } else {
            console.error(
              "Keycloak logout failed:",
              response.status,
              response.statusText,
            );
          }
          console.log("Keycloak session terminated successfully");
        } catch (error) {
          console.error("Error terminating Keycloak session:", error);
        }
      }
    },
  },
});
