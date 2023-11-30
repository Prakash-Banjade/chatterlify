'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";

import clsx from "clsx";

type DesktopItemProp = {
    label: string,
    href: string,
    icon: any,
    active?: boolean,
    onClick?: () => void,
}

export default function DesktopItem({ label, href, icon: Icon, active, onClick }: DesktopItemProp) {

    const handleClick = (): void => onClick && onClick();

    return (
        <li onClick={handleClick}>
            <Button variant={active ? 'secondary' : 'ghost'} className={clsx(`p-2`, !active && 'text-muted-foreground')} asChild>
                <Link href={href} className="flex items-center gap-2">
                    <Icon className={`h-5 w-5`} />
                    <span className="sr-only">{label}</span>
                </Link>
            </Button>
        </li>
    )
}