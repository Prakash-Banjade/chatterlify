'use client'

import { Input } from '@/components/ui/input'
import { GetUsersProps } from '@/lib/actions/getUsers';
import { User } from '@prisma/client';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Label } from '@radix-ui/react-label';
import { debounce } from 'lodash';
import React, { useRef } from 'react'

type Props = {
    setState: React.Dispatch<React.SetStateAction<GetUsersProps>>,
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>,
    initialState: GetUsersProps,
}

export default function UserFilterBox({ setState, setLoading, initialState }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleKeyDown = debounce(async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!inputRef.current) return;
        if (!inputRef.current.value) setState(initialState);

        const isAlphabet = /^[a-zA-Z]$/.test(e.key); // checking if the entered key is alphabet
        if (!isAlphabet) return;

        setLoading && setLoading(true);
        try {
            const params = new URLSearchParams({
                query: inputRef.current.value,
            });
            const res = await fetch(`/api/user/search?${params}`);
            const data: GetUsersProps = await res.json();

            setState(data);

            console.log(data);

        } catch (e) {
            console.log(e);
        } finally {
            setLoading && setLoading(false);
        }
    }, 500);

    return (
        <div className="flex items-center gap-3 relative">
            <div className="absolute left-4">
                <MagnifyingGlassIcon className='h-5 w-5 text-muted-foreground' />
            </div>
            <Label htmlFor='searchUser' className="sr-only">Search people</Label>
            <Input ref={inputRef} type="search" className="rounded-full pl-12" id="searchUser" placeholder="Search users" onKeyDown={handleKeyDown} />
        </div>
    )
}
