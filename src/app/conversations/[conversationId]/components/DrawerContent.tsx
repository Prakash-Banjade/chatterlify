'use client'

import useOtherUser from '@/hooks/useOtherUser'
import React, { useMemo } from 'react'

import { format } from 'date-fns';
import { Conversation, User } from '@prisma/client';
import Avatar from '@/app/components/Avatar';
import AlertDialogBox from '../../../../components/utils/AlertDialog';
import ConfirmModal from './ConfirmModal';
import GroupAvatar from '@/app/components/GroupAvatar';
import { Button } from '@/components/ui/button';
import { Pencil2Icon } from '@radix-ui/react-icons';
import useActiveList from '@/hooks/useActiveList';

type Props = {
    data: Conversation & {
        users: Partial<User>[]
    }
}

export default function DrawerContent({ data }: Props) {

    const otherUser = useOtherUser(data);
    const { members } = useActiveList();

    const joinedDate = useMemo(() => {
        return format(new Date(otherUser.createdAt!), 'PP');
    }, [otherUser.createdAt])

    const title = useMemo(() => {
        return data.name || otherUser.name;
    }, [data.name, otherUser.name])

    const statusText = useMemo(() => {
        if (data?.isGroup) return `${data.users.length} members`
        return !!members.includes(otherUser?.email!) ? 'Active' : 'Offline'
    }, [data, members, otherUser?.email])

    return (
        <div className="relative mt-10 flex-1">
            <div className="flex flex-col items-center">
                <div className="mb-2">
                    {
                        data?.isGroup ? <GroupAvatar users={data.users} /> : <Avatar user={otherUser} activeStatus className='w-12 h-12' />
                    }
                </div>
                <div className="flex items-center relative">
                    <span>{title}</span>
                    {data.isGroup && <Button size="icon" variant={"ghost"} className='absolute -right-9'>
                        <Pencil2Icon className='text-muted-foreground' />
                    </Button>}
                </div>
                <span className="text-xs text-muted-foreground">{statusText}</span>

                
            </div>
            <div className='mt-10 flex flex-col'>
                {
                    !data.isGroup && (
                        <>
                            <div className=''>
                                <p className='text-center text-sm'>{otherUser.bio}</p>
                            </div>
                        </>
                    )
                }
                <dl className="space-y-8 sm:space-y-6 mt-12">
                    {
                        data.isGroup ? (
                            <>
                                <section className="w-full flex items-center gap-4 justify-between">
                                    <p>Members</p>
                                    <Button variant="outline" size="sm">Add member</Button>
                                </section>
                                <div className="flex flex-wrap gap-2 max-h-[400px] overflow-y-auto">
                                    {data.users.map(user => (
                                        <div className="flex gap-3 items-center" key={user.id}>
                                            <Avatar user={user} activeStatus />
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-sm">{user.name}</span>
                                                <span className="text-xs text-muted-foreground break-words text-center">{user.email}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 sm:2-40 sm:flex-shrink-0">
                                        Email
                                    </dt>
                                    <dd className='mt-1 text-sm sm:col-span-2 break-words'>
                                        {otherUser.email}
                                    </dd>
                                </div>
                               {Boolean(otherUser.socialLinks?.length) && <div>
                                    <dt className="text-sm font-medium text-gray-500 sm:2-40 sm:flex-shrink-0">
                                        I am available on
                                    </dt>
                                    <dd className='mt-1 text-sm sm:col-span-2 break-words'>
                                        <div className='flex flex-col gap-3 text-sm'>
                                            {
                                                otherUser.socialLinks?.map((url, i) => (
                                                    <a href={url} target='_blank' rel="noopener noreferrer" key={i}>{url}</a>
                                                ))
                                            }
                                        </div>
                                    </dd>
                                </div>}
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 sm:2-40 sm:flex-shrink-0">
                                        Joined
                                    </dt>
                                    <dd className='mt-1 text-sm sm:col-span-2'>
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
            <div className="mt-10 flex flex-col gap-2 items-center justify-center">
                    <ConfirmModal />
                    <span className="text-sm text-muted-foreground">Delete</span>
            </div>
        </div>
    )
}
