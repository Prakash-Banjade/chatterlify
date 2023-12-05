'use client'

import { Input } from '@/components/ui/input'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Label } from '@radix-ui/react-label';
import React from 'react'

type Props = {
    query: string,
    setQuery: React.Dispatch<React.SetStateAction<string>>,
    label?: string
}

export default function UserFilterBox({ query, setQuery, label }: Props) {

    return (
        <div className="flex items-center gap-3 relative">
            <div className="absolute left-4">
                <MagnifyingGlassIcon className='h-5 w-5 text-muted-foreground' />
            </div>
            <Label htmlFor='searchUser' className="sr-only">Search people</Label>
            <Input type="search" className="rounded-full pl-12" id="searchUser" value={query} placeholder={`Search ${label? label : 'conversation'}`} onChange={e => setQuery(e.target.value)} />
        </div>
    )
}
