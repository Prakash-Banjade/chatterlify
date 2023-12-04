import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Icons } from "../ui/icons"
import { Button, buttonVariants } from "../ui/button"
import clsx from "clsx"

type Props = {
    children: React.ReactNode,
    title?: string | JSX.Element,
    description?: string,
    loading?: boolean,
    handleFunction: () => void,
    trigger: JSX.Element,
    actionIcon?: JSX.Element,
    destructive?: boolean,
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function AlertDialogBox({ children, title, description, handleFunction, loading, trigger, destructive, actionIcon, open, setOpen }: Props) {


    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex gap-3">
                        {actionIcon}
                        <div className="flex flex-col gap-1">
                            <AlertDialogTitle>{title || "Are you absolutely sure?"}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {description}
                            </AlertDialogDescription>
                        </div>
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                    <Button onClick={() => handleFunction()} disabled={loading} className={clsx(destructive && buttonVariants({ variant: "destructive" }))} asChild>
                        {trigger}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
