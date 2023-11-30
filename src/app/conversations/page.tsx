'use client'

import useConversation from "@/hooks/useConversation";
import EmptyState from "../components/EmptyState";
import clsx from "clsx";

export default function Home() {
    const {isOpen} =  useConversation();

    return (
        <div className={clsx(
            'lg:pl-80 h-full lg:block',
            isOpen ? 'block' : 'hidden'
        )}>
            asllf;asjfie
        </div>
    )
}