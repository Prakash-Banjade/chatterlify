'use client'

import { useEffect, useRef, useState } from "react";
import { FullMessage } from "../../../../../types"
import useConversation from "@/hooks/useConversation";
import MessageBox from "./MessageBox";
import { pusherClient } from "@/lib/pusher";
import { find } from "lodash";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import Avatar from "@/app/components/Avatar";
import useOtherUser from "@/hooks/useOtherUser";
import useAudio from "@/hooks/useAudio";

type Props = {
    initialMessages: FullMessage[],
    currentUser: User,
}

export default function Body({ initialMessages, currentUser }: Props) {

    const [messages, setMessages] = useState(initialMessages);
    const bottomRef = useRef<HTMLDivElement>(null);
    const [typingUser, setTypingUser] = useState<User | null>(null);
    const { play: typingPlay } = useAudio('/audios/typing.mp3')

    const { conversationId } = useConversation();

    useEffect(() => {
        fetch(`/api/conversations/${conversationId}/seen`, {
            method: 'POST'
        }).catch((e) => console.log(e))
    }, [conversationId])

    useEffect(() => {
        pusherClient.subscribe(conversationId);
        if (bottomRef?.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' })

        const newMessageHandler = (message: FullMessage) => {
            fetch(`/api/conversations/${conversationId}/seen`, {
                method: 'POST'
            }).catch((e) => console.log(e)) // as the message is received, we have user has seen the message

            setTypingUser(null);

            setMessages(prev => {
                if (find(prev, { id: message.id })) { // this will look for the message in the array, if found, it will not add the message to the array, else it will add the message to the array, avoid duplication of same message
                    return prev;
                }

                return [...prev, message]
            })

            // scroll to new message added
            if (bottomRef?.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' })
        }

        const updateMessageHandler = (newMessage: FullMessage) => {
            setMessages(prev => prev.map(message => {
                return message.id === newMessage.id ? newMessage : message; // if the message id matches, update the message with seen array, else return the message as it is. 
            }))

        }

        let timeOut: NodeJS.Timeout;
        const typingMessageHandler = (user: User) => {
            console.log(user?.email, currentUser?.email)
            if (user && user?.email !== currentUser?.email && conversationId) {
                setTypingUser(user)
                typingPlay(); // typing sound

                timeOut = setTimeout(() => {
                    setTypingUser(null);
                }, 5000)
            }
        }

        // listen for new messages
        pusherClient.bind('messages:new', newMessageHandler)
        pusherClient.bind('message:update', updateMessageHandler);
        pusherClient.bind('message:typing', typingMessageHandler)

        return () => {
            pusherClient.unsubscribe(conversationId)
            pusherClient.unbind('messages:new', newMessageHandler)
            pusherClient.unbind('message:update', updateMessageHandler);
            pusherClient.unbind('message:typing', typingMessageHandler)
            clearTimeout(timeOut)
        }

    }, [conversationId])

    return (
        <div className="flex-1 overflow-y-auto">
            {
                messages?.map((message, i) => {

                    return (
                        <MessageBox
                            key={message.id}
                            isLast={i === messages.length - 1}
                            data={message}
                        />
                    )
                })
            }
            {typingUser && <div className="activity flex gap-3 p-4 items-center">
                <Avatar user={typingUser} />
                <p className="text-muted-foreground text-sm">
                    typing...
                </p>
            </div>}
            <div ref={bottomRef} className="mt-24 h-10" />
        </div>
    )
}