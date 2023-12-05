
'use client'

import { User } from "@prisma/client";
import { Avatar as AvatarWrapper, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils";
import Image from "next/image";
import useActiveList from "@/hooks/useActiveList";

type Props = {
    user: User | {
        id?: string,
        name: string,
        image: string,
        email: string,
    },
    activeStatus?: boolean,
    className?: string,
}

export default function Avatar({ user, activeStatus, className = '' }: Props) {

    const { members } = useActiveList();
    
    if (!user) return (
        <Image alt="avatar" src="/images/avatarPlaceholder.webp" height={42} width={42} className="w-auto" />
    )

    const { image, name } = user;

    const words = name?.split(' ');
    const initials = words?.map(word => word.charAt(0).toUpperCase());
    const abbreviation = initials?.join('');

    const isActive = !!members.includes(user.email!);

    return (
        <div className="relative">
            <AvatarWrapper className={cn("h-8 w-8", className)}>
                <AvatarImage src={image!} />
                <AvatarFallback>{abbreviation}</AvatarFallback>
            </AvatarWrapper>

            {!!activeStatus && isActive && <span className="absolute block rounded-full bg-green-500 ring-2 ring-background top-0 right-0 h-2 w-2 md:h-2.5 md:w-2.5"></span>}
        </div>
    )
}