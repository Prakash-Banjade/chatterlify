'use client'

import { Button } from "@/components/ui/button";
import { User } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react";
import Avatar from "./Avatar";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/ui/icons";

type Props = {
    user: User
}

export default function UserBox({ user }: Props) {

    const router = useRouter();

    const { toast } = useToast();

    const handleClick = useCallback(
        async () => {
            try {
                const res = await fetch(`/api/conversations`, {
                    method: 'POST',
                    body: JSON.stringify({
                        userId: user.id
                    })
                })


                const data = await res.json();

                if (res?.ok) {
                    router.push(`/conversations/${data?.id}`)
                }

            } catch (e) {
                if (e instanceof Error) {
                    return toast({
                        title: 'Error creating group chat',
                        description: e.message,
                        variant: 'destructive'
                    })
                }
                return toast({
                    title: 'Error creating group chat',
                    description: 'Something went wrong',
                    variant: 'destructive'
                })
            }
        }, [user, router, toast]
    )
    return (
        <Button variant="ghost" className="w-full relative flex items-center space-x-3 px-3 justify-start py-8 gap-2" onClick={handleClick}>
            <Avatar user={user} className="md:h-10 md:w-10 h-12 w-12" />
            <div className="flex flex-col items-start justify-start">
                <span className="text-base font-medium">{user?.name}</span>
            </div>
        </Button>
    )
}