import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Conversation, User } from "@prisma/client"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import DrawerContent from "./DrawerContent"

type Props = {
    data: Conversation & {
        users: Partial<User>[]
    },
}

export default function ProfileDrawer({ data }: Props) {


    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-2xl text-sky-600 hover:text-sky-500">
                    <DotsHorizontalIcon />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    {/* <SheetTitle>Are you sure absolutely sure?</SheetTitle> */}

                    <DrawerContent data={data} />

                </SheetHeader>
            </SheetContent>
        </Sheet>

    )
}