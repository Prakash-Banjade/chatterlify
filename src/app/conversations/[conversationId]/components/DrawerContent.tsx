'use client'

import useOtherUser from '@/hooks/useOtherUser'
import React, { useMemo } from 'react'

import { format } from 'date-fns';
import { Conversation, User } from '@prisma/client';
import Avatar from '@/app/components/Avatar';
import AlertDialogBox from './AlertDialog';

type Props = {
    data: Conversation & {
        users: User[]
    }
}

export default function DrawerContent({ data }: Props) {

    const otherUser = useOtherUser(data);

    const joinedDate = useMemo(() => {
        return format(new Date(otherUser.createdAt), 'PP');
    }, [otherUser.createdAt])

    const title = useMemo(() => {
        return data.name || otherUser.name;
    }, [data.name, otherUser.name])

    const statusText = useMemo(() => {
        if (data?.isGroup) return `${data.users.length} members`
        return 'Active'
    }, [data])

    return (
        <div className="relative mt-10 flex-1 px-4 sm:px-6">
            <div className="flex flex-col items-center">
                <div className="mb-2">
                    <Avatar user={otherUser} activeStatus className="h-12 w-12" />
                </div>
                <span>{title}</span>
                <span className="text-xs text-muted-foreground">{statusText}</span>

                <div className="mt-10 flex flex-col gap-2 items-center justify-center">
                    <AlertDialogBox />
                    <span className="text-sm text-muted-foreground">Delete</span>
                </div>
            </div>
            <div className='mt-10 flex flex-col'>
                <dl className="space-y-8 sm:space-y-6">
                    {
                        !data.isGroup && (
                            <>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 sm:2-40 sm:flex-shrink-0">
                                        Email
                                    </dt>
                                    <dd className='mt-1 tet-sm sm:col-span-2'>
                                        {otherUser.email}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 sm:2-40 sm:flex-shrink-0">
                                        Joined
                                    </dt>
                                    <dd className='mt-1 tet-sm sm:col-span-2'>
                                        <time dateTime={joinedDate}>
                                            {joinedDate}
                                        </time>
                                    </dd>
                                </div>
                            </>
                        )
                    }
                </dl>
            </div>
        </div>
    )
}
