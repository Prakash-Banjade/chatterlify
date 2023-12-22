'use client'

import UserBox from "./UserBox";
import UserFilterBox from "./UserFilterBox";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoadingUsers } from "./sidebar/UsersLoading";
import { GetUsersProps } from "@/lib/actions/getUsers";
import useListenNewConversation from "@/hooks/useListenNewConversation";
import { useCurrentUsers } from "@/context/UsersProvider";


export default function UsersList({ users, hasNextPage }: GetUsersProps) {

    const { usersState, setUsersState } = useCurrentUsers();
    const [usersLoading, setUsersLoading] = useState(false);
    const [usersSearching, setUsersSearching] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1)

    useListenNewConversation(); // listening for conversation:new pusher event

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
            setCurrentPage(prev => prev - 1);
        } finally {
            setUsersLoading(false);
        }
    }

    return (
        <>
            <div className="mb-4 px-4">
                <UserFilterBox setState={setUsersState} setLoading={setUsersSearching} initialState={{ users, hasNextPage }} />
            </div>
            <section className="px-1.5">
                {!usersSearching && usersState.users?.map((user) => (
                    <UserBox key={user.id} user={user} />
                ))}
                {!usersLoading && !usersState.users?.length && !usersSearching && <div className="text-muted-foreground text-sm px-4 py-2">No user found</div>}

                {
                    usersState.hasNextPage && !usersLoading && !usersSearching && (
                        <div className="flex justify-center mt-10">
                            <Button onClick={loadMore} disabled={usersLoading}>
                                Load more
                            </Button>
                        </div>
                    )
                }

                {
                    (usersLoading || usersSearching) && <LoadingUsers className="mt-2 px-3 gap-8" />
                }
            </section>
        </>
    )
}