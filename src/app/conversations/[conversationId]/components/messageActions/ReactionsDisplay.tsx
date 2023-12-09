import clsx from "clsx";
import { FullMessage } from "../../../../../../types";
import { reactionObj } from "./ReactionBtn";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Avatar from "@/app/components/Avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface ReactionsDisplayProps {
    message: FullMessage,
    isOwn: boolean,
    currentUserEmail: string | null | undefined,
}

export default function ReactionsDisplay({ message, isOwn, currentUserEmail }: ReactionsDisplayProps) {
    if (!message?.reactions?.length) return null;

    return (
        <Dialog>
            <DialogTrigger>
                <div className={clsx("absolute z-10 rounded-full flex items-center justify-center border-2  -bottom-5 right-0 border-background bg-backgroundSecondary p-0.5", !isOwn && 'right-0 left-auto')}>
                    {
                        message.reactions.map(reaction => {
                            return (
                                <span key={reaction.id} className="text-sm flex items-center">
                                    {reactionObj[reaction.reaction]}
                                    {/* <span className="text-muted-foreground">{reaction.count}</span> */}
                                </span>
                            )
                        })
                    }
                </div>
            </DialogTrigger>
            <DialogContent className="bg-backgroundSecondary">
                <DialogHeader>
                    <DialogTitle className="text-center mb-5">Message reactions</DialogTitle>
                    <Separator />
                    <DialogDescription className="h-48 overflow-y-auto">
                        <div className="flex flex-col gap-1 mt-2">
                            {
                                message?.reactions?.map(r => {
                                    return (
                                        <Button variant="ghost" className="py-8 justify-start" key={r.id}>
                                            <div className="flex items-center justify-between grow flex-1 gap-2">
                                                <div className="flex gap-3 items-center">
                                                    <Avatar user={r.user} className="md:h-10 md:w-10" />
                                                    <div className="flex flex-col gap-1">
                                                        <p className="text-foreground font-medium">{r.user?.name}</p>
                                                        {currentUserEmail === r.user.email &&
                                                            <p className="text-xs text-muted-foreground">Click to remove</p>
                                                        }
                                                    </div>
                                                </div>

                                                <p className="text-3xl">
                                                    {reactionObj[r.reaction]}
                                                </p>
                                            </div>
                                        </Button>
                                    )
                                })
                            }

                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>

    )
}