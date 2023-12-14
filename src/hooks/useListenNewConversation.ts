'use client'
import { useCurrentConversations } from "@/context/ConversationsProvider";
import { useSession } from "next-auth/react";
import useConversation from "./useConversation";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { pusherClient } from "@/lib/pusher";
import { FullConversation } from "../../types";
import { find } from "lodash";
import useAudio from "./useAudio";

export default function useListenNewConversation() {
    const session = useSession();
    const { conversationState, setConversationState } = useCurrentConversations();
    const { conversationId } = useConversation();
    const router = useRouter();

    const pusherKey = useMemo(() => {
        return session.data?.user?.email;
    }, [session.data?.user?.email])

    const { play: playNewMsg } = useAudio('/audios/new_message.mp3')
    
    useEffect(() => {
        if (!pusherKey) return;
        pusherClient.subscribe(pusherKey)

        const newConversationHanlder = (conversation: FullConversation) => {
            setConversationState(current => {
                if (find(current.conversations, { id: conversation.id })) return current

                return ({
                    ...current,
                    conversations: [conversation, ...current.conversations]
                })
            });
            playNewMsg();
        }

        pusherClient.bind('conversation:new', newConversationHanlder);

        return () => {
            pusherClient.unsubscribe(pusherKey)
            pusherClient.unbind('conversation:new', newConversationHanlder);
        }
    }, [pusherKey, conversationState, conversationId, router])
}