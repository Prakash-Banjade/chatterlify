import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { FaceIcon } from "@radix-ui/react-icons"
import { FullMessage, FullReaction } from "../../../../../../types"
import useConversation from "@/hooks/useConversation"
import { useEffect, useState } from "react"
import useAudio from "@/hooks/useAudio"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { v4 as uuidv4 } from 'uuid';
import { User } from "@prisma/client"


export const reactionObj: Record<string, string> = {
    heart: "❤️",
    haha: "😆",
    wow: "😲",
    angry: "😠",
    like: "👍",
}

interface Props {
    message: FullMessage,
    setMessages: React.Dispatch<React.SetStateAction<FullMessage[]>>,
    currentUser: User,
}

export default function ReactionBtn({ message, setMessages, currentUser }: Props) {

    const [open, setOpen] = useState<boolean>(false);
    const { play: boxOpen } = useAudio('/audios/reaction_box_open.mpeg')
    const { play: reactionSound } = useAudio('/audios/reaction_send.mpeg')

    const { conversationId } = useConversation();

    const handleReactionClick = async (key: string) => {
        setOpen(false);
        reactionSound();
        // instantly adding reaction which will be later reset by pusher event
        const newReaction: FullReaction = {
            id: uuidv4(),
            userId: currentUser.id,
            user: currentUser,
            reaction: key,
            messageId: message.id
        }
        setMessages(prev => prev.map(msg => {
            return msg.id === message.id ? {
                ...msg,
                reactions: [...msg?.reactions?.filter(r => r.userId !== currentUser.id), newReaction],
            } : msg;
        }))

        try {
            const res = await fetch(`/api/conversations/${conversationId}/${message.id}/reaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reaction: key
                })
            })
        } catch (e) {
            console.log(e)
        }
    }

    // playing audio as the reaction box is open
    useEffect(() => {
        if (open) {
            boxOpen();
        }
    }, [open, boxOpen])

    const actionBtn = (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" className="p-0 rounded-[50%]">
                        <FaceIcon />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>React</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>

    )

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button size="icon" variant="ghost" className="p-0 rounded-[50%]">
                    <FaceIcon />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-0 border-none bg-transparent bg-none shadow-none">
                <div className="flex items-center gap-1 px-3 py-1 rounded-full border-border border bg-backgroundSecondary">
                    {
                        Object.keys(reactionObj).map(key => {
                            return (
                                <Button variant="link" className="p-0 hover:no-underline md:text-3xl text-2xl hover:-translate-y-2 transition-all" key={key} value={key} onClick={() => handleReactionClick(key)}>
                                    {reactionObj[key]}
                                </Button>
                            )
                        })
                    }
                </div>
            </PopoverContent>
        </Popover>
    )
}
