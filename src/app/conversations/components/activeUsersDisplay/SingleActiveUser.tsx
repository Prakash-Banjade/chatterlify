'use client'

import Avatar from '@/app/components/Avatar';
import { Button } from '@/components/ui/button';
import { User } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react'
import { FullConversation } from '../../../../../types';
import useOtherUser from '@/hooks/useOtherUser';

type Props = {
    data: FullConversation,
    activeMembersEmail: string[]
}

export default function SingleActiveUser({ data, activeMembersEmail }: Props) {
    const router = useRouter();

    const user = useOtherUser(data);

    let name = user?.name?.split(' ')[0]
    name = name && name.length > 7 ? `${name.slice(0, 7)}...` : name

    const handleClick = useCallback(() => {
        router.push(`/conversations/${data.id}`)
    }, [user.id, router])

    if (!user || !user?.name || !user?.email || data.isGroup || !activeMembersEmail.includes(user.email)) return null
    // if (!activeMembersEmail.includes(user.email)) return null;

    return (
        <div className="flex flex-col items-center justify-center gap-1 cursor-pointer" role="button" onClick={() => handleClick()} title={user.name}>
            <Avatar user={user} activeStatus className="md:h-10 md:w-10 h-12 w-12" />
            <span className='text-sm text-center'>{name}</span>
        </div>
    )
}
