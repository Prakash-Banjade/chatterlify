'use client'

import { Conversation } from "@prisma/client"
import { FullConversation } from "../../../../types"
import { useState } from "react"
import { useRouter } from "next/navigation";
import useConversation from "@/hooks/useConversation";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { MdOutlineGroupAdd } from "react-icons/md"
import ConversationBox from "./ConversationBox";

type Props = {
    initialItems: FullConversation[] | undefined,
}

export default function ConversationLIst({ initialItems }: Props) {

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
                        <h2 className="text-2xl font-semiboldbold">Messages</h2>
                    </div>
                    <Button variant="outline" size="icon" className="text-xl" title="Create new group">
                        <MdOutlineGroupAdd />
                    </Button>
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
