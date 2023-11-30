'use client'

import useRoutes from "@/hooks/useRoutes"
import { useState } from "react";
import DesktopItem from "./DesktopItem";
import { ThemeToggle } from "@/components/ThemeToggle";

import { User } from "@prisma/client"; // after prisma db push, prisma automatically created User type 
import Avatar from "../Avatar";

type DesktopSidebarProps = {
    currentUser: User
}

export default function DesktopSidebar({ currentUser }: DesktopSidebarProps) {

    const routes = useRoutes();
    const [isOpen, setIsOpen] = useState(false);

    console.log(currentUser)

    return (
        <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:w-[4.5rem] xl:px-6 lg:border-r-[1px] lg:bg-4 lg:flex lg:flex-col justify-between">
            <nav className="mt-4 flex flex-col justify-between">
                <ul className="flex flex-col items-center space-y-1" role="list">
                    {
                        routes.map(route => (
                            <DesktopItem
                                key={route.label}
                                href={route.href}
                                label={route.label}
                                icon={route.icon}
                                active={!!route.active}
                                onClick={route.onClick}
                            />
                        ))
                    }
                    <li>
                        <ThemeToggle />
                    </li>
                </ul>
            </nav>

            <nav className="flex flex-col justify-between items-center mt-4 pb-2">
                <div className="cursor-pointer">
                    <Avatar user={currentUser} />
                </div>
            </nav>
        </div>
    )
}