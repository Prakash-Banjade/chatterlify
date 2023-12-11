import { useSession } from "next-auth/react"
import { FullMessage } from "../../../../../types"
import clsx from "clsx";
import Avatar from "@/app/components/Avatar";
import { format } from "date-fns";
import Image from "next/image";
import ImageModal from "./ImageModal";
import ReactionsDisplay from "./messageActions/ReactionsDisplay";
import SideActionBtns from "./messageActions/SideActionBtns";
import { User } from "@prisma/client";

type Props = {
    isLast?: boolean,
    data: FullMessage,
    setMessages: React.Dispatch<React.SetStateAction<FullMessage[]>>,
    currentUser: User,
}

export default function MessageBox({ isLast, data, setMessages, currentUser }: Props) {
    const session = useSession();

    const isOwn = session?.data?.user?.email === data?.sender?.email;
    const seenList = (data?.seen || [])
        .filter(user => user.email !== data?.sender?.email)
        .map(user => user.name)
        .join(', ')

    const container = clsx(
        "flex gap-3 p-4 select-none",
        isOwn && 'justify-end'
    )

    const avatar = clsx(isOwn && "order-2")

    const body = clsx(
        "flex flex-col gap-2 group",
        isOwn && 'items-end',
        !data.image && 'flex-1 max-w-full',
    )

    const message = clsx(
        "text-sm w-fit relative select-none",
        isOwn && !data?.image ? 'bg-sky-600 text-white' : 'bg-backgroundSecondary',
        data.image ? 'rounded-md p-0' : isOwn ? 'rounded-[20px] rounded-tr-md py-2 px-3 max-w-[80%]' : 'rounded-[20px] rounded-tl-md py-2 px-3 max-w-[80%]'
    )

    return (
        <div className={container}>
            {!isOwn && <div className={avatar}>
                <Avatar user={data?.sender} />
            </div>}

            <div className={body}>
                <div className="flex items-center gap-1">
                    <div className="text-sm text-gray-500">
                        {isOwn ? 'You' : data?.sender?.name}
                    </div>
                    <div className="text-xs text-gray-400">
                        {format(new Date(data?.createdAt), 'p')}
                    </div>
                </div>
                <div className="flex items-center gap-3 group">
                    <SideActionBtns message={data} isOwn={isOwn} setMessages={setMessages} currentUser={currentUser} />
                    <div className={message}>
                        {
                            data?.image ? (
                                <ImageModal src={data.image}>
                                    <Image
                                        alt="Image"
                                        height="288"
                                        width="288"
                                        src={data.image}
                                        className="object-cover cursor-pointer hover:scale110 transition w-auto h-auto rounded-lg"
                                    />
                                </ImageModal>
                            ) : (
                                <div className="w-full whitespace-normal break-words">{data?.body}</div>
                            )
                        }
                        <ReactionsDisplay message={data} isOwn={isOwn} currentUser={currentUser} setMessages={setMessages} />
                    </div>
                </div>
                {
                    (isLast && isOwn && seenList.length > 0) && (
                        <div className="text-xs font-light mt-5 text-muted-foreground">Seen by <span className="font-medium">{seenList}</span></div>
                    )
                }
            </div>
        </div>
    )
}
