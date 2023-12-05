'use client'

import { User } from "@prisma/client";
import UserBox from "./UserBox";
import UserFilterBox from "./UserFilterBox";
import { useState } from "react";

export default function UsersList({ users }: { users: User[] | null }) {

    const [query, setQuery] = useState('')


    const filteredUsers = (users: User[] | null): User[] | null => {
        if (!users) return null;
        return users.filter(user => user?.name?.toLowerCase().includes(query.toLocaleLowerCase()))
    }


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