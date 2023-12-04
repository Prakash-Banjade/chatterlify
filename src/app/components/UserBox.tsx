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

    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

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
            } finally {
                setIsLoading(false);
            }
        }, [user, router, toast]
    )
    return (
        <Button variant="ghost" className="w-full relative flex items-center space-x-3 px-3 justify-start py-8 gap-2" onClick={handleClick}>
            <Avatar user={user} className="md:h-10 md:w-10 h-12 w-12" />
            <div className="flex flex-col items-start justify-start gap-3">
                <span className="text-base font-medium">{user?.name}</span>
                {isLoading && <div className="flex items-center">
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    <span>Creating conversation...</span>
                </div>}
            </div>
        </Button>
    )
}