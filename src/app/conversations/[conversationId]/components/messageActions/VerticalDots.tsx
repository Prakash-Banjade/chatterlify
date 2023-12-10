import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SideActionBtnsProps } from "./SideActionBtns";
import useConversation from "@/hooks/useConversation";
import { useEffect } from "react";
import { pusherClient } from "@/lib/pusher";

interface VerticalDotsProps extends SideActionBtnsProps { }

export default function VerticalDots({ message, setMessages, isOwn, currentUser }: VerticalDotsProps) {
    const { conversationId } = useConversation();

    const onRemove = async () => {
        if (!isOwn) return;

        // instant removal which will be reset by pusher action
        setMessages(prev => {
            return [...prev.filter(m => m.id !== message.id)]
        })

        try {
            const res = await fetch(`/api/messages`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messageId: message.id,
                    conversationId,
                })
            })

            console.log(res);
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        pusherClient.subscribe(conversationId)

        const onDelete = (id: string) => {
            if (!id) return;
            console.log(id)

            setMessages(prev => {
                return [...prev.filter(m => m.id !== id)]
            })
        }

        pusherClient.bind('messages:delete', onDelete)

        return () => {
            pusherClient.unsubscribe(conversationId)
            pusherClient.unbind('messages:delete', onDelete)
        }
    }, [conversationId, setMessages])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="p-0 rounded-[50%]" title="More">
                    <DotsVerticalIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {isOwn && <DropdownMenuItem role="button" className="cursor-pointer" onClick={() => onRemove()}>Unsend</DropdownMenuItem>}
                <DropdownMenuItem>Copy</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}