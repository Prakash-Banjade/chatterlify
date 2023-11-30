'use client'

import { Button } from "@/components/ui/button";
import { User } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react";
import Avatar from "./Avatar";

type Props = {
    user: User
}

export default function UserBox({ user }: Props) {

    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const handleClick = useCallback(
        async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/conversations`, {
                    method: 'POST',
                    body: JSON.stringify({
                        userId: user.id
                    })
                })

                console.log(res);

                const data = await res.json();

                if (res?.ok) {
                    router.push(`/conversations/${data?.id}`)
                }

            } catch (e) {

            } finally {
                setIsLoading(false);
            }
        }, [user, router]
    )
    return (
        <Button variant="ghost" className="w-full relative flex items-center space-x-3 px-3 justify-start py-8 gap-2" onClick={handleClick}>
            <Avatar user={user} className="md:h-10 md:w-10 h-12 w-12" />
            <span className="text-base font-medium">{user?.name}</span>
        </Button>
    )
}