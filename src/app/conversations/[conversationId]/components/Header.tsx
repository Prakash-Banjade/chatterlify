'use client'
import Avatar from "@/app/components/Avatar";
import { Button } from "@/components/ui/button";
import useOtherUser from "@/hooks/useOtherUser";
import { Conversation, User } from "@prisma/client";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useMemo } from "react";
import ProfileDrawer from "./ProfileDrawer";
import GroupAvatar from "@/app/components/GroupAvatar";
import useActiveList from "@/hooks/useActiveList";
import { FaPhoneAlt, FaVideo } from "react-icons/fa";

type HeaderProps = {
    conversation: Conversation & {
        users: Partial<User>[]
    }
}

export default function Header({ conversation }: HeaderProps) {

    const otherUser = useOtherUser(conversation);
    const { members } = useActiveList();

    const statusText = useMemo(() => {
        if (conversation.isGroup) {
            return `${conversation.users.length} members`
        }
        return !!members.includes(otherUser?.email!) ? 'Active' : 'Offline'
    }, [conversation, members, otherUser?.email])

    return (
        <div className="w-full flex border-b sm:px-4 border-border py-3 px-1.5 lg:px-6 justify-between items-center shadow-sm">
            <div className="flex gap-3 items-center">
                <Button variant="ghost" size="icon" className="lg:hidden flex" asChild>
                    <Link href="/conversations"><ArrowLeftIcon className="h-5 w-5" /></Link>
                </Button>

                {
                    conversation?.isGroup ? <GroupAvatar users={conversation.users} /> : <Avatar user={otherUser} activeStatus />
                }
                <section className="flex flex-col gap-1">
                    <span className="text-sm">{conversation.name || otherUser.name}</span>
                    <span className="text-xs text-muted-foreground">{statusText}</span>
                </section>
            </div>
            
            <div className="flex items-center gap-6">
                <Button variant="ghost" size={'icon'} className="text-sky-600 sm:text-2xl text-xl hover:text-sky-500" title="Start a voice call">
                    <FaPhoneAlt />
                </Button>
                <Button variant="ghost" size={'icon'} className="text-sky-600 sm:text-2xl text-xl hover:text-sky-500" title="Start a video call">
                    <FaVideo />
                </Button>
                <div className="2xl:hidden">
                    <ProfileDrawer data={conversation} />
                </div>
            </div>

        </div>
    )
}
