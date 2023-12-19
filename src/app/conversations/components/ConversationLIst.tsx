'use client'

import { useEffect, useState } from "react"
import useConversation from "@/hooks/useConversation";
import clsx from "clsx";
import ConversationBox from "./ConversationBox";
import { User } from "@prisma/client";
import GroupChatModal from "./GroupChatModal";
import ActiveUsers from "./activeUsersDisplay/ActiveUsers";
import { useCurrentConversations } from "@/context/ConversationsProvider";
import { LoadingUsers } from "@/app/components/sidebar/UsersLoading";
import { Button } from "@/components/ui/button";
import { GetConversationsProps } from "@/lib/actions/getConversations";
import useListenNewConversation from "@/hooks/useListenNewConversation";
import useListenUpdateConversation from "@/hooks/useListenUpdateConversation";
import ConversationSearchBox from "@/app/components/ConversationSearchBox";
import useSetupServiceWorker from "@/hooks/useSetupServiceWorker";
import { getReadyServiceWorker } from "@/lib/serviceWorker";

type Props = {
    users: Partial<User>[],
    initialState: GetConversationsProps
}

export default function ConversationLIst({ users, initialState }: Props) {

    const { conversationState, setConversationState } = useCurrentConversations();
    const [conversationSearching, setConversationSearching] = useState(false);
    const [conversationsLoading, setConversationsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1)

    const { conversationId, isOpen } = useConversation();

    useListenNewConversation(); // listening conversation:new pusher event
    useListenUpdateConversation(); // listening conversation:update pusher event
    useSetupServiceWorker(); // setup service worker

    const loadMore = async () => {
        setCurrentPage(prev => prev + 1);
        setConversationsLoading(true);

        const params = new URLSearchParams({
            page: (currentPage + 1).toString(),
            limit: '10'
        })

        try {
            const res = await fetch(`/api/conversations?${params}`)

            const data: GetConversationsProps = await res.json();

            setConversationState(prev => {
                return {
                    conversations: [...prev.conversations, ...data.conversations],
                    hasNextPage: data.hasNextPage
                }
            });

        } catch (e) {
            setCurrentPage(prev => prev - 1);
        } finally {
            setConversationsLoading(false);
        }
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
                    <ConversationSearchBox setLoading={setConversationSearching} initialState={initialState} />
                </div>

                <div className="px-4 mb-4">
                    <ActiveUsers conversation={conversationState.conversations} />
                </div>

                {!conversationSearching && <div className="px-1.5">
                    {
                        conversationState.conversations?.map((item) => (
                            <ConversationBox
                                key={item.id}
                                data={item}
                                selected={conversationId === item.id}
                            />
                        ))
                    }
                </div>}

                {!conversationState.conversations?.length && !conversationsLoading && !conversationSearching && <div className="text-muted-foreground text-sm px-4 py-2">No conversation found</div>}

                {
                    conversationState.hasNextPage && !conversationsLoading && !conversationSearching && (
                        <div className="flex justify-center mt-10">
                            <Button onClick={loadMore} disabled={conversationsLoading}>
                                Load more
                            </Button>
                        </div>
                    )
                }

                {
                    (conversationsLoading || conversationSearching) && <LoadingUsers className="mt-2 px-4" />
                }
            </div>
        </aside>
    )
}
