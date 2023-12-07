'use client'

import useAudio from "@/hooks/useAudio";
import useConversation from "@/hooks/useConversation";
import { pusherClient } from "@/lib/pusher";
import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";
import { FullConversation, FullMessage } from "../../types";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";


export const ActionHandler = () => {

    const session = useSession();
    const { conversationId, isOpen } = useConversation();
    const { toast } = useToast();
    const pathname = usePathname();
    const { play: playNewMsg } = useAudio('/audios/new_message.mp3')


    const router = useRouter()

    const pusherKey = useMemo(() => {
        return session.data?.user?.email;
    }, [session.data?.user?.email])

    useEffect(() => {
        if (!pusherKey) return;

        pusherClient.subscribe(pusherKey);
        pusherClient.subscribe(conversationId);

        const newConversationHanlder = (conversation: FullConversation) => {
            playNewMsg();
        }

        const updateConversationHanlder = (conversation: FullConversation) => {
            if (!conversation.messages || conversationId === conversation.id) return;
            const message = conversation.messages[0];
            if (message.sender.email === pusherKey) return;
            // console.log('new conversation: ', conversation)
            playNewMsg();
            toast({
                title: message.sender.name || '',
                description: message.image ? 'Sent an image' : (message.body && message.body.length > 40) ? `${message.body.slice(0, 40)}...` : message.body,
                action: <ToastAction altText="View" onClick={() => router.push(`/conversations/${conversation.id}`)}>View</ToastAction>
            })
        }


        const newMessageHandler = (message: FullMessage) => {
            console.log('new message: ', message)
        }

        const updateMessageHandler = (newMessage: FullMessage) => {
        }

        pusherClient.bind('messages:new', newMessageHandler)
        pusherClient.bind('message:update', updateMessageHandler);
        pusherClient.bind('conversation:new', newConversationHanlder);
        pusherClient.bind('conversation:update', updateConversationHanlder);

        return () => {
            pusherClient.unsubscribe(pusherKey);
            pusherClient.unsubscribe(conversationId)
            pusherClient.unbind('conversation:new', newConversationHanlder);
            pusherClient.unbind('conversation:update', updateConversationHanlder);
            pusherClient.unbind('messages:new', newMessageHandler)
            pusherClient.unbind('message:update', updateMessageHandler);
        }
    }, [pusherKey, conversationId, router, pathname])


    return null;
}