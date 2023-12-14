'use client'

import { useEffect, useRef, useState } from "react";
import { FullMessage } from "../../../../../types"
import useConversation from "@/hooks/useConversation";
import MessageBox from "./MessageBox";
import { User } from "@prisma/client";
import Avatar from "@/app/components/Avatar";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import useListenMessageEvents from "@/hooks/useListenMessageEvents";

type Props = {
    initialMessages: FullMessage[],
    currentUser: Partial<User>,
}

export default function Body({ initialMessages, currentUser }: Props) {

    const [messages, setMessages] = useState(initialMessages);
    const bottomRef = useRef<HTMLDivElement>(null);
    const [typingUser, setTypingUser] = useState<Partial<User> | null>(null);

    const { conversationId } = useConversation();

    useEffect(() => {
        fetch(`/api/conversations/${conversationId}/seen`, {
            method: 'POST'
        }).catch((e) => console.log(e))
        if (bottomRef?.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }, [conversationId])

    useListenMessageEvents({ setTypingUser, bottomRef, setMessages }); // listening for messages changes

    if (!initialMessages.length) {
        return (
            <div className="flex-1 items-center flex justify-center flex-col gap-5">
                <ChatBubbleIcon className="text-muted-foreground h-20 w-20 sm:h-28 sm:w-28 opacity-50" />
                <p className="text-muted-foreground lg:text-2xl text-xl">No chats here yet...</p>
            </div>
        )
    }

    return (
        <div className="flex-1 overflow-y-auto flex flex-col">
            {
                messages?.map((message, i) => {

                    return (
                        <MessageBox
                            key={message.id}
                            isLast={i === messages.length - 1}
                            data={message}
                            setMessages={setMessages}
                            currentUser={currentUser}
                        />
                    )
                })
            }
            {typingUser && <div className="activity flex gap-3 p-4 items-center">
                <Avatar user={typingUser} />
                <p className="text-muted-foreground text-sm rounded-[20px] rounded-tl-md py-2 px-3 bg-backgroundSecondary">
                    typing...
                </p>
            </div>}
            <div ref={bottomRef} className="mt-20" />
        </div>
    )
}