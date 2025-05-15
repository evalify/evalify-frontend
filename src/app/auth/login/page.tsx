"use client"


import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { signOut } from "next-auth/react"

export default function SignIn() {
    return (
        <div>
            <Button onClick={() => signIn("keycloak")}> Sign In</Button>

            <Button onClick={() => signOut()}>SignOut with Keycloak</Button>
        </div >
    )
} 