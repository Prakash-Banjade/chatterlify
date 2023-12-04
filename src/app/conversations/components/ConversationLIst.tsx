'use client'

import { FullConversation } from "../../../../types"
import { useState } from "react"
import { useRouter } from "next/navigation";
import useConversation from "@/hooks/useConversation";
import clsx from "clsx";
import ConversationBox from "./ConversationBox";
import { User } from "@prisma/client";
import GroupChatModal from "./GroupChatModal";

type Props = {
    initialItems: FullConversation[] | undefined,
    users: User[] | null,
}

export default function ConversationLIst({ initialItems, users }: Props) {

    const [items, setItems] = useState(initialItems);

    const router = useRouter();

    const { conversationId, isOpen } = useConversation();

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
