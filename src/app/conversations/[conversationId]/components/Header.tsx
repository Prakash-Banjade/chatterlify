'use client'
import Avatar from "@/app/components/Avatar";
import { Button } from "@/components/ui/button";
import useOtherUser from "@/hooks/useOtherUser";
import { Conversation, User } from "@prisma/client";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useMemo } from "react";
import ProfileDrawer from "./ProfileDrawer";

type HeaderProps = {
    conversation: Conversation & {
        users: User[]
    }
}

export default function Header({ conversation }: HeaderProps) {

    const otherUser = useOtherUser(conversation);

    const statusText = useMemo(() => {
        if (conversation.isGroup) {
            return `${conversation.users.length} members`
        }
        return 'Active'
    }, [conversation])

    return (
        <div className="w-full flex border-b sm:px-4 border-border py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
            <div className="flex gap-3 items-center">
                <Button variant="ghost" size="icon" className="lg:hidden flex" asChild>
                    <Link href="/conversations"><ArrowLeftIcon className="h-5 w-5" /></Link>
                </Button>

                <Avatar user={otherUser} activeStatus />
                <section className="flex flex-col gap-1">
                    <span className="text-sm">{conversation.name || otherUser.name}</span>
                    <span className="text-xs text-muted-foreground">{statusText}</span>
                </section>
            </div>

            <ProfileDrawer data={conversation} />
               

        </div>
    )
}
