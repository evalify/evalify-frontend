
import NextAuth from "next-auth"
import Keycloak from "next-auth/providers/keycloak"
import jwt from "jsonwebtoken"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Keycloak({
            profile: (profile) => {
                console.log(profile)
                const roles = profile?.realm_access?.roles || [];
                return {
                    id: profile.id,
                    name: profile.name,
                    email: profile.email,
                    roles,
                };
            }
        })
    ],
    pages: {
        signIn: "/auth/login",
    },
    callbacks: {
        async jwt({ token, user, account, profile }) {

            console.log("account " + JSON.stringify(account))
            let roles = undefined as
                | { [key: string]: { roles: Array<any> } }
                | undefined


            if (account?.access_token) {
                let decodedToken = jwt.decode(account?.access_token)
                if (decodedToken && typeof decodedToken !== 'string') {
                    roles = decodedToken?.realm_access
                }
            }
            token = { ...token, roles: roles?.roles }
            console.log("[jwt callback] token " + JSON.stringify(token))
            return token;
        },
        session: async ({ session, token, user }) => {
            if (session?.user) {
                session.user.id = token.sub;
            }
            console.log("[session callback] token " + JSON.stringify(token))

            return session;
        },
    }

})


declare module "next-auth" {
    interface User {
        role?: string;
    }
}