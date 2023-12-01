'use client'

import { useRef, useState } from "react";
import { FullMessage } from "../../../../../types"
import useConversation from "@/hooks/useConversation";
import MessageBox from "./MessageBox";

type Props = {
    initialMessages: FullMessage[]
}

export default function Body({ initialMessages }: Props) {

    const [messages, setMessages] = useState(initialMessages);
    const bottomRef = useRef<HTMLDivElement>(null);

    const { conversationId } = useConversation();

    return (
        <div className="flex-1 overflow-y-auto">
            {
                messages?.map((message, i) => (
                    <MessageBox
                        key={message.id}
                        isLast={i === messages.length - 1}
                        data={message}
                    />
                ))
            }
            <div ref={bottomRef} className="pt-24" />
        </div>
    )
}