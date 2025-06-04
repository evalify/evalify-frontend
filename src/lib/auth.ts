import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";
import { decode } from "jsonwebtoken";

interface KeycloakToken {
  access_token: string;
  refresh_token?: string;
  expires_at: number;
  idToken?: string;
  error?: string;
}

async function refreshKeycloakAccessToken(token: KeycloakToken) {
  try {
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
      console.error("Failed to refresh access token", refreshedTokens);
      throw refreshedTokens;
    }

    const decoded = decode(refreshedTokens.access_token);
    let roles: string[] = [];
    if (decoded && typeof decoded === "object") {
      roles = decoded.realm_access?.roles || [];
    }
    console.log("Refreshed access token successfully");
    return {
      ...token,
      access_token: refreshedTokens.access_token,
      refresh_token: refreshedTokens.refresh_token ?? token.refresh_token,
      expires_at: Math.floor(Date.now() / 1000) + refreshedTokens.expires_in,
      roles: roles, // Ensure roles are preserved or re-decoded if necessary
      error: null, // Clear any previous error
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error refreshing access token", error);
    }
    return {
      ...token,
      error: "RefreshAccessTokenError",
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
        let roles: string[] = [];
        if (decoded && typeof decoded === "object") {
          roles = decoded.realm_access?.roles || [];
        }
        return {
          ...token,
          access_token: account.access_token,
          refresh_token: account.refresh_token,
          expires_at: account.expires_at,
          roles: roles,
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
        session.access_token = token.access_token as string;
        if (token.error) {
          session.error = token.error as string;
        }
      }
      return session;
    },
  },
});
