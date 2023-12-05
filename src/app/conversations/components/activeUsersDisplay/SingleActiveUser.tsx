'use client'

import Avatar from '@/app/components/Avatar';
import { Button } from '@/components/ui/button';
import { User } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react'

type Props = {
    user: User
}

export default function SingleActiveUser({ user }: Props) {
    const router = useRouter();


    let name = user?.name?.split(' ')[0]
    name = name && name.length > 7 ? `${name.slice(0, 7)}...` : name

    const handleClick = useCallback(() => {
        router.push(`/conversations/${user.id}`)
    }, [user.id, router])

    if (!user || !user?.name) return null;

    return (
        <div className="flex flex-col items-center justify-center gap-1 cursor-pointer" role="button" onClick={() => handleClick()} title={user.name}>
            <Avatar user={user} activeStatus className="md:h-10 md:w-10 h-12 w-12" />
            <span className='text-sm text-center'>{name}</span>
        </div>
    )
}
