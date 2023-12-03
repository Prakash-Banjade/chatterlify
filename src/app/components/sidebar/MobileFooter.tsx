'use client'

import useConversation from "@/hooks/useConversation";
import useRoutes from "@/hooks/useRoutes"
import MobileItem from "./MobileItem";
import { useMemo } from "react";

export default function MobileFooter() {

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
                        onClick={route.onClick}
                    />
                ))
            }
        </div>
    )
}