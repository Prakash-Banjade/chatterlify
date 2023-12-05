import { Button } from "@/components/ui/button";
import Link from "next/link";

import clsx from "clsx";

type MobileItemProp = {
    label: string,
    href: string,
    icon: any,
    active?: boolean,
    onClick?: () => void,
}

export default function MobileItem({ label, href, icon: Icon, active, onClick }: MobileItemProp) {

    const handleClick = (): void => onClick && onClick();

    return (
        <Button variant={active ? 'secondary' : 'ghost'} className={clsx(`rounded-none flex leading-6 text-sm gap-x-3 font-semibold w-full p-5 py-7`, !active && 'text-muted-foreground')} asChild>
            <Link href={href}>
                <div className="flex items-center gap-2" onClick={handleClick}>
                    <Icon className={`h-6 w-6`} />
                    <span className="sr-only">{label}</span>
                </div>
            </Link>
        </Button>
    )
}