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
    title: string,
    description?: string,
    content: React.ReactNode,
}


export default function CustomDialog({ children, title, description, content }: Props) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <section className="mt-5">
                    {content}
                </section>
            </DialogContent>
        </Dialog>

    )
}