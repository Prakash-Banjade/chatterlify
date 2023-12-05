'use client'

import useActiveList from "@/hooks/useActiveList"
import { useMemo } from "react";
import SingleActiveUser from "./SingleActiveUser";
import { User } from "@prisma/client";

export default function ActiveUsers({ users }: { users: User[] | null }) {
    const { members } = useActiveList();

    if (!users?.length) return null;

    const activeUsers = useMemo(() => {
        const activeMembersEmail = Array.from(new Set(members));
        const activeUsers = users?.filter(user => activeMembersEmail.includes(user.email!));

        return activeUsers;
    }, [members])


    return (
        <div className="flex gap-4 max-w-full overflow-auto">
            {
                activeUsers.map(user => <SingleActiveUser user={user} key={user.id} />)
            }
        </div>
    )
}