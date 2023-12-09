import clsx from "clsx";
import { FullMessage } from "../../../../../../types";
import ReactionBtn from "./ReactionBtn";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { BsFillReplyFill } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { User } from "@prisma/client";


interface SideActionBtnsProps {
    message: FullMessage,
    isOwn: boolean,
    setMessages: React.Dispatch<React.SetStateAction<FullMessage[]>>,
    currentUser: User,
}

function VerticalDots() {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" className="p-0 rounded-[50%]">
                        <DotsVerticalIcon />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>More</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

function ReplyBtn() {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" className="p-0 text-lg text-muted-foreground rounded-[50%]">
                        <BsFillReplyFill />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Reply</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>

    )
}

export default function SideActionBtns({ message, setMessages, isOwn, currentUser }: SideActionBtnsProps) {
    return (
        <div className={clsx("items-center text-muted-foreground flex group-hover:opacity-100 group-hover:pointer-events-auto pointer-events-none opacity-0", !isOwn && "order-2 flex-row-reverse")}>
            <VerticalDots />
            <ReplyBtn />
            <ReactionBtn message={message} setMessages={setMessages} currentUser={currentUser} />
        </div>
    )
}