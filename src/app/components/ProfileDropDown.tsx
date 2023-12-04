'use client'

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AvatarIcon, ExitIcon } from "@radix-ui/react-icons"
import { signOut } from "next-auth/react"
import Link from "next/link"


export default function ProfileDropDown({ children }: { children: React.ReactNode }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-0">
                    <Button asChild variant="ghost" className="flex items-center gap-3 px-1 w-full justify-start">
                        <Link href="/settings">
                            <AvatarIcon className="h-5 w-5" />
                            Profile
                        </Link>
                    </Button>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-0">
                    <Button variant="ghost" className="flex items-center gap-3 px-1 w-full justify-start" onClick={() => signOut()}>
                        <ExitIcon className="h-5 w-5" />
                        Log out
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}
