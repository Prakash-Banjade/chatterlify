import { useCurrentConversations } from "@/context/ConversationsProvider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useConversation from "./useConversation";
import { useEffect, useMemo } from "react";
import { pusherClient } from "@/lib/pusher";
import { FullConversation } from "../../types";

export default function useListenUpdateConversation() {
    const { conversationState, setConversationState } = useCurrentConversations();

    const session = useSession();
    const router = useRouter();


    const { conversationId } = useConversation();

    const pusherKey = useMemo(() => {
        return session.data?.user?.email;
    }, [session.data?.user?.email])

    useEffect(() => {
        if (!pusherKey) return;

        pusherClient.subscribe(pusherKey);

        const updateConversationHanlder = (conversation: FullConversation) => {
            if (!conversation.messages) return;

            setConversationState((current) => ({
                ...current,
                conversations: current.conversations.map((currentConversation) => {
                    if (currentConversation.id === conversation.id) {
                        return {
                            ...currentConversation,
                            messages: conversation.messages
                        };
                    }

                    return currentConversation;
                })
            }));
        }


        pusherClient.bind('conversation:update', updateConversationHanlder);

        return () => {
            pusherClient.unsubscribe(pusherKey);
            pusherClient.unbind('conversation:update', updateConversationHanlder);
        }
    }, [pusherKey, conversationId, router, conversationState])
}