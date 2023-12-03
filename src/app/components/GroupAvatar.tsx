import { User } from "@prisma/client"
import Avatar from "./Avatar"
import { cn } from "@/lib/utils"

type Props = {
    users: User[],
    className?: string,
}

export default function GroupAvatar({ users = [], className }: Props) {
    return (
        <div className={cn("relative flex items-center justify-center flex-col h-12 w-12 gap-1.5", className)}>
            <Avatar user={users[0]} className="h-5 w-5 top-0" />
            <div className="flex items-center justify-between gap-1.5">
                <Avatar user={users[1]} className="h-5 w-5 left-0 bottom-0" />
                <Avatar user={users[2]} className="h-5 w-5 bottom-0 right-0" />
            </div>

        </div>
    )
}