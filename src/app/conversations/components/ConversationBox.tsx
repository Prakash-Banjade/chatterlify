'use client'
import { useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Conversation, Message, User } from "@prisma/client"
import { useSession } from "next-auth/react"
import clsx from "clsx"
import { FullConversation } from "../../../../types"
import useOtherUser from "@/hooks/useOtherUser"
import { Button } from "@/components/ui/button"
import Avatar from "@/app/components/Avatar"
import { format } from 'date-fns'

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

    const userEmail = useMemo(() => {
        return session?.data?.user?.email;
    }, [session?.data?.user?.email])

    const hasSeen = useMemo(() => { // different approach
        if (!lastMessage) return false;
        if (!userEmail) return false;
        return !!lastMessage.seen.find(user => user.id === userEmail);
    }, [userEmail, lastMessage])

    const lastMessageText = useMemo(() => {
        if (lastMessage?.image) return 'Sent an image';

        if (lastMessage?.body) return lastMessage.body;

        return 'Started a conversation'
    }, [lastMessage])

    return (
        <Button variant={selected ? 'secondary' : 'ghost'} className="w-full relative flex items-center space-x-3 px-3 justify-start py-8 gap-2" onClick={handleClick}>
            <Avatar user={otherUser} className="md:h-10 md:w-10 h-12 w-12" />
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
                    <p className={clsx("text-left text-sm truncate", hasSeen && 'text-muted-foreground')}>{lastMessageText}</p>
                </section>
            </div>
        </Button>
    )
}
