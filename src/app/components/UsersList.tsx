'use client'

import { User } from "@prisma/client";
import UserBox from "./UserBox";
import UserFilterBox from "./UserFilterBox";
import { useCallback, useEffect, useMemo, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { useSession } from "next-auth/react";
import { find } from "lodash";
import { FullConversation } from "../../../types";
import useAudio from "@/hooks/useAudio";
import { useCurrentConversations } from "@/context/ConversationsProvider";
import useConversation from "@/hooks/useConversation";
import { useRouter } from "next/navigation";

export default function UsersList({ users }: { users: User[] | null }) {

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

    const filteredUsers = useCallback((users: User[] | null): User[] | null => {
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

    return (
        <aside className="fixed inset-y-0 pb-20 lg:bg-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r w-full left-0">

            <div className="mb-4 pt-4">
                <div className="flex-col flex">
                    <h2 className=" px-4 text-2xl mb-4">Users</h2>
                    <div className="mb-4 px-4">
                        <UserFilterBox query={query} setQuery={setQuery} label="users" />
                    </div>
                    <section className="px-1.5">
                        {filteredUsers(users)?.map((user) => (
                            <UserBox key={user.id} user={user} />
                        ))}
                        {!filteredUsers(users)?.length && <div className="text-muted-foreground text-sm px-4 py-2">No user found</div>}
                    </section>
                </div>
            </div>

        </aside>
    )
}