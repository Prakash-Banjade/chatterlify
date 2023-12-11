'use client'

import { User } from "@prisma/client";
import UserBox from "./UserBox";
import UserFilterBox from "./UserFilterBox";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { useSession } from "next-auth/react";
import { find } from "lodash";
import { FullConversation } from "../../../types";
import useAudio from "@/hooks/useAudio";
import { useCurrentConversations } from "@/context/ConversationsProvider";
import useConversation from "@/hooks/useConversation";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LoadingUsers } from "./sidebar/UsersLoading";
import { GetUsersProps } from "@/lib/actions/getUsers";


export default function UsersList({ users, hasNextPage }: GetUsersProps) {

    const [usersState, setUsersState] = useState<GetUsersProps>({ users, hasNextPage })
    const [usersLoading, setUsersLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1)

    const [query, setQuery] = useState('')
    const session = useSession();
    const { items, setItems } = useCurrentConversations();
    const { conversationId } = useConversation();
    const router = useRouter();

    const pusherKey = useMemo(() => {
        return session.data?.user?.email;
    }, [session.data?.user?.email])
    // message audio
    const { play: playNewMsg } = useAudio('/audios/new_message.mp3')

    const filteredUsers = useCallback((users: Partial<User>[] | null): Partial<User>[] | null => {
        if (!users) return null;
        return users.filter(user => user?.name?.toLowerCase().includes(query.toLocaleLowerCase()))
    }, [query])

    useEffect(() => {
        if (!pusherKey) return;
        pusherClient.subscribe(pusherKey)

        const newConversationHanlder = (conversation: FullConversation) => {
            console.log('new conversation added with: ', conversation.users[1])
            setItems(prev => {
                if (find(prev, { id: conversation.id })) return prev

                return [conversation, ...prev]
            });
            playNewMsg();
        }

        pusherClient.bind('conversation:new', newConversationHanlder);

        return () => {
            pusherClient.unsubscribe(pusherKey)
            pusherClient.unbind('conversation:new', newConversationHanlder);
        }
    }, [pusherKey, items, conversationId, router])


    const loadMore = async () => {
        setCurrentPage(prev => prev + 1);
        setUsersLoading(true);

        const params = new URLSearchParams({
            page: (currentPage + 1).toString(),
            limit: '10'
        })

        try {
            const res = await fetch(`/api/user?${params}`)

            const data: GetUsersProps = await res.json();

            setUsersState(prev => {
                return {
                    users: [...prev.users, ...data.users],
                    hasNextPage: data.hasNextPage
                }
            });

        } catch (e) {
            setCurrentPage(prev => prev + 1);
        } finally {
            setUsersLoading(false);
        }
    }

    return (
        <>
            <div className="mb-4 px-4">
                <UserFilterBox query={query} setQuery={setQuery} label="users" />
            </div>
            <section className="px-1.5">
                {filteredUsers(usersState.users)?.map((user) => (
                    <UserBox key={user.id} user={user} />
                ))}
                {!filteredUsers(usersState.users)?.length && <div className="text-muted-foreground text-sm px-4 py-2">No user found</div>}

                {
                    usersState.hasNextPage && !usersLoading && (
                        <div className="flex justify-center mt-10">
                            <Button onClick={loadMore} disabled={usersLoading}>
                                Load more
                            </Button>
                        </div>
                    )
                }

                {
                    usersLoading && <LoadingUsers className="mt-2 px-3" />
                }
            </section>
        </>
    )
}