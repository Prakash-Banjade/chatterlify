'use client'

import useActiveList from "@/hooks/useActiveList"
import SingleActiveUser from "./SingleActiveUser";
import { FullConversation } from "../../../../../types";

export default function ActiveUsers({ conversation }: { conversation: FullConversation[] }) {
    const { members } = useActiveList();


    return (
        <div className="flex gap-4 max-w-full overflow-auto">
            {
                conversation?.map(con => <SingleActiveUser data={con} key={con.id} activeMembersEmail={members} />)
            }
        </div>
    )
}