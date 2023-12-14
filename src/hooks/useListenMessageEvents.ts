import { pusherClient } from "@/lib/pusher";
import { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import useConversation from "./useConversation";
import { User } from "@prisma/client";
import { FullMessage, FullReaction } from "../../types";
import { find } from "lodash";
import useAudio from "./useAudio";
import { useSession } from "next-auth/react";

interface Props {
    setTypingUser: Dispatch<SetStateAction<Partial<Partial<User> | null>>>;
    setMessages: Dispatch<SetStateAction<FullMessage[]>>
    bottomRef: React.RefObject<HTMLDivElement>
}

export default function useListenMessageEvents({ setTypingUser, setMessages, bottomRef }: Props) {

    const { conversationId } = useConversation()
    const { play: typingPlay } = useAudio('/audios/typing.mp3')
    const session = useSession();
    const currentUserEmail = useMemo(() => {
        return session.data?.user?.email;
    }, [session.data?.user?.email])


    useEffect(() => {
        pusherClient.subscribe(conversationId);

        const newMessageHandler = (message: FullMessage) => {
            fetch(`/api/conversations/${conversationId}/seen`, {
                method: 'POST'
            }).catch((e) => console.log(e)) // as the message is received, we have user has seen the message

            setTypingUser(null);
            console.log('message: ', message);

            setMessages(prev => {
                if (find(prev, { id: message.id })) { // this will look for the message in the array, if found, it will not add the message to the array, else it will add the message to the array, avoid duplication of same message
                    return prev;
                }

                return [...prev, message]
            })
            console.log('message displayed')

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
            if (user && user?.email !== currentUserEmail && conversationId) {
                setTypingUser(user)
                typingPlay(); // typing sound

                timeOut = setTimeout(() => {
                    setTypingUser(null);
                }, 5000)
            }
        }

        const reactionHandler = ({ messageId, reactions }: { messageId: string, reactions: FullReaction[] }) => {
            setMessages(prev => prev.map(message => {
                return message.id === messageId ? {
                    ...message,
                    reactions,
                } : message;
            }))

        }

        // listen for new messages
        pusherClient.bind('messages:new', newMessageHandler)
        pusherClient.bind('message:update', updateMessageHandler);
        pusherClient.bind('message:typing', typingMessageHandler)
        pusherClient.bind('messages:reaction', reactionHandler)

        return () => {
            pusherClient.unsubscribe(conversationId)
            pusherClient.unbind('messages:new', newMessageHandler)
            pusherClient.unbind('message:update', updateMessageHandler);
            pusherClient.unbind('message:typing', typingMessageHandler)
            pusherClient.unbind('messages:reaction', reactionHandler)
            clearTimeout(timeOut)
        }
    }, [conversationId])
}