'use client'

import Image from "next/image"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

type Props = {
    children: React.ReactNode,
    src?: string
}

export default function ImageModal({ children, src }: Props) {

    if (!src) return null;

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-auto block h-[500px]">
                <Image
                    alt="image"
                    src={src}
                    fill
                    className="object-cover rounded-lg"
                />
            </DialogContent>
        </Dialog>
    )
}
