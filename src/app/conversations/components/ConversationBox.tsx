'use client'
import { useCallback, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Conversation, Message, User } from "@prisma/client"
import { useSession } from "next-auth/react"
import clsx from "clsx"
import { FullConversation } from "../../../../types"
import useOtherUser from "@/hooks/useOtherUser"
import { Button } from "@/components/ui/button"
import Avatar from "@/app/components/Avatar"
import { format } from 'date-fns'
import GroupAvatar from "@/app/components/GroupAvatar"

type Props = {
    data: FullConversation,
    selected?: boolean,
}

export default function ConversationBox({ data, selected }: Props) {

    const otherUser = useOtherUser(data);

    const session = useSession();
    const router = useRouter();

    const handleClick = useCallback(() => {
        router.push(`/conversations/${data.id}`)
    }, [data.id, router])

    const lastMessage = useMemo(() => {
        const messages = data.messages || [];

        return messages[messages.length - 1]
    }, [data.messages])

    // useEffect(() => {
    //     console.log('lastMessage: ', data)
    // }, [data])

    const userEmail = useMemo(() => {
        return session?.data?.user?.email;
    }, [session?.data?.user?.email])

    const lastMessageSenderEmail = useMemo(() => {
        return lastMessage?.sender?.email
    }, [lastMessage])

    const hasSeen = useMemo(() => {
        if (!lastMessage) return false;
        if (!userEmail) return false;

        const seenArray = lastMessage.seen || []

        return seenArray.filter(user => user.email === userEmail).length !== 0;
    }, [userEmail, lastMessage])

    const lastMessageText = useMemo(() => {
        if (lastMessage?.image) return 'Sent an image';

        if (lastMessage?.body) return lastMessage.body.length > 20 ? lastMessage.body.slice(0, 20) + '...' : lastMessage.body;

        return 'Started a conversation'
    }, [lastMessage])

    return (
        <Button variant={selected ? 'secondary' : 'ghost'} className="w-full relative flex items-center mb-1 space-x-3 px-3 justify-start py-8 gap-2" onClick={handleClick}>
            {
                data.isGroup ? <GroupAvatar users={data.users} className="md:h-10 md:w-10 h-12 w-12" /> : (<Avatar user={otherUser} className="md:h-10 md:w-10 h-12 w-12" activeStatus />)
            }
            <div className="flex flex-1 flex-col gap-1">
                <section className="justify-between items-center flex gap-1">
                    <span className="text-base font-medium">{data.name || otherUser?.name}</span>
                    {
                        lastMessage?.createdAt && (
                            <p className="text-xs text-muted-foreground font-light">
                                {format(new Date(lastMessage?.createdAt), 'p')}
                            </p>
                        )
                    }
                </section>
                <section>
                    <p className={clsx("text-left text-sm truncate", hasSeen && 'text-muted-foreground font-light')}>{lastMessageSenderEmail === userEmail ? `You: ${lastMessageText}` : lastMessageText}</p>
                </section>
            </div>
        </Button>
    )
}
