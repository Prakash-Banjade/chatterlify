'use client'

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function Users() {
    return (
        <>
            <h1>Hello from Users</h1>
            <Button onClick={() => signOut()}>Log Out</Button>
        </>
    )
}