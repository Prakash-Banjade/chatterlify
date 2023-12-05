'use client'

import useConversation from "@/hooks/useConversation";
import useRoutes from "@/hooks/useRoutes"
import MobileItem from "./MobileItem";
import { useMemo } from "react";
import ProfileDropDown from "../ProfileDropDown";
import Avatar from "../Avatar";
import { User } from "@prisma/client";
import { Button } from "@/components/ui/button";

type MobileFooterProps = {
    currentUser: User
}

export default function MobileFooter({ currentUser }: MobileFooterProps) {

    const routes = useRoutes();
    const { isOpen } = useConversation();

    if (isOpen) return null;

    return (
        <div className="fixed w-full bottom-0 z-50 lg:hidden flex border-t-[1px] items-center justify-center bg-background">

            {
                routes.map(route => (
                    <MobileItem
                        key={route.label}
                        href={route.href}
                        label={route.label}
                        icon={route.icon}
                        active={!!route.active}
                    />
                ))
            }
            <ProfileDropDown>
                <Button variant="ghost" className="rounded-none flex leading-6 text-sm gap-x-3 font-semibold w-full p-5 py-7">
                    <Avatar user={currentUser} />
                </Button>
            </ProfileDropDown>
        </div>
    )
}