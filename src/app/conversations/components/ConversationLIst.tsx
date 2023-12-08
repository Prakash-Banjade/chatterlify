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
import UserFilterBox from "@/app/components/UserFilterBox";
import ActiveUsers from "./activeUsersDisplay/ActiveUsers";
import useAudio from "@/hooks/useAudio";

type Props = {
    initialItems: FullConversation[],
    users: User[] | null,
    currentUser?: User,
}

export default function ConversationLIst({ initialItems, users, currentUser }: Props) {

    const [items, setItems] = useState(initialItems);
    const [query, setQuery] = useState('')
    const session = useSession();
    const router = useRouter();


    const { conversationId, isOpen } = useConversation();

    const pusherKey = useMemo(() => {
        return session.data?.user?.email;
    }, [session.data?.user?.email])

    // message audio
    const { play: playNewMsg } = useAudio('/audios/new_message.mp3')

    useEffect(() => {
        if (!pusherKey) return;

        pusherClient.subscribe(pusherKey);

        const newConversationHanlder = (conversation: FullConversation) => {
            setItems(prev => {
                if (find(prev, { id: conversation.id })) return prev

                return [conversation, ...prev]
            });
            playNewMsg();
        }

        const updateConversationHanlder = (conversation: FullConversation) => {
            if (!conversation.messages) return;

            setItems((current) => current.map((currentConversation) => {
                if (currentConversation.id === conversation.id) {
                    return {
                        ...currentConversation,
                        messages: conversation.messages
                    };
                }

                return currentConversation;
            }));
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
    }, [pusherKey, conversationId, router, items])

    const filteredConversations = (conversations: FullConversation[]) => {
        if (!query) return conversations;

        const otherUser = (conversation: FullConversation) => {
            return conversation.users.filter(user => user.email !== pusherKey)[0]
        }

        return (
            conversations.filter(con => {
                if (con.isGroup) {
                    return con.name?.toLocaleLowerCase().includes(query.toLocaleLowerCase())
                } else {
                    return otherUser(con).name?.toLocaleLowerCase().includes(query.toLocaleLowerCase())
                }
            })
        )
    }


    return (
        <aside className={clsx(`
            fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r
        `, isOpen ? 'hidden' : 'block w-full left-0'
        )}>
            <div className="">
                <div className="flex gap-2 items-center mb-4 pt-4 px-4 justify-between">
                    <div className="">
                        <h2 className="text-2xl">Chats</h2>
                    </div>
                    <GroupChatModal users={users} />
                </div>

                <div className="mb-4 px-4">
                    <UserFilterBox query={query} setQuery={setQuery} />
                </div>

                <div className="px-4 mb-4">
                    <ActiveUsers conversation={items} />
                </div>

                <div className="px-1.5">
                    {
                        filteredConversations(items)?.map((item) => (
                            <ConversationBox
                                key={item.id}
                                data={item}
                                selected={conversationId === item.id}
                            />
                        ))
                    }
                </div>

                {!filteredConversations(items)?.length && <div className="text-muted-foreground text-sm px-4 py-2">No conversation found</div>}


            </div>
        </aside>
    )
}
