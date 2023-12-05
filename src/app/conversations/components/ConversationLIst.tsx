'use client'

import { FullConversation } from "../../../../types"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation";
import useConversation from "@/hooks/useConversation";
import clsx from "clsx";
import ConversationBox from "./ConversationBox";
import { User } from "@prisma/client";
import GroupChatModal from "./GroupChatModal";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/lib/pusher";
import { find } from "lodash";

type Props = {
    initialItems: FullConversation[],
    users: User[] | null,
}

export default function ConversationLIst({ initialItems, users }: Props) {

    const [items, setItems] = useState(initialItems);
    const session = useSession();

    const router = useRouter();

    const { conversationId, isOpen } = useConversation();

    const pusherKey = useMemo(() => {
        return session.data?.user?.email;
    }, [session.data?.user?.email])

    useEffect(() => {
        if (!pusherKey) return;

        pusherClient.subscribe(pusherKey);

        const newConversationHanlder = (conversation: FullConversation) => {
            setItems(prev => {
                if (find(prev, { id: conversation.id })) return prev

                return [conversation, ...prev]
            });
        }

        const updateConversationHanlder = (conversation: FullConversation) => {
            console.log('updatedMessage: ', conversation )
            if (!conversation.messages) return;

            let updatedConversation: FullConversation;

            items.forEach(item => {
                if (item.id === conversation.id) {
                    updatedConversation = {
                        ...item,
                        messages: conversation.messages,
                    }
                }
            })

            const updatedItems = items.filter(item => item.id !== conversation.id)
            updatedItems.unshift(updatedConversation!)

            setItems(updatedItems)
        }

        const removeHandler = (conversation: FullConversation) => {
            setItems(prev => {
                return [...prev.filter(prevCon => prevCon.id !== conversation.id)]
            })

            if (conversationId === conversation.id) {
                router.push('/conversations')
            }
        }

        pusherClient.bind('conversation:new', newConversationHanlder);
        pusherClient.bind('conversation:update', updateConversationHanlder);
        pusherClient.bind('conversation:remove', removeHandler);

        return () => {
            pusherClient.unsubscribe(pusherKey);
            pusherClient.unbind('conversation:new', newConversationHanlder);
            pusherClient.unbind('conversation:update', updateConversationHanlder);
            pusherClient.unbind('conversation:remove', removeHandler);
        }
    }, [pusherKey, conversationId, router])

    useEffect(() => {
        console.log('items: ', items);
    }, [items])


    return (
        <aside className={clsx(`
            fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r
        `, isOpen ? 'hidden' : 'block w-full left-0'
        )}>
            <div className="px-4">
                <div className="flex gap-2 items-center mb-4 pt-4 justify-between">
                    <div className="">
                        <h2 className="text-2xl font-semiboldbold">Chats</h2>
                    </div>
                    <GroupChatModal users={users} />
                </div>

                {
                    items?.map((item) => (
                        <ConversationBox
                            key={item.id}
                            data={item}
                            selected={conversationId === item.id}
                        />
                    ))
                }

            </div>
        </aside>
    )
}
