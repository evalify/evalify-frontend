import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";
import { decode } from "jsonwebtoken";

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
    maxAge: 5 * 60 * 60,
  },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        const decoded = decode(account.access_token);
        if (decoded && typeof decoded === "object") {
          token.roles = decoded.realm_access?.roles || [];
          token.access_token = account.access_token;
          token.refresh_token = account.refresh_token;
          token.expires_at = account.expires_at;
        }
        // Refresh token if expired
        if (token.expires_at && Date.now() >= token.expires_at * 1000) {
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

          const refreshed = await response.json();
          if (!response.ok) throw new Error("Failed to refresh access token");

          token.access_token = refreshed.access_token;
          token.refresh_token = refreshed.refresh_token ?? token.refresh_token;
          token.expires_at =
            Math.floor(Date.now() / 1000) + refreshed.expires_in;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.roles = token.roles as string[];
        session.access_token = token.access_token as string;
      }
      return session;
    },
  },
});
