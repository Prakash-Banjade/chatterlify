'use client'

import CustomDialog from "@/components/utils/CustomDialog"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { MdOutlineGroupAdd } from "react-icons/md"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import UsersSelect from "./UsersSelect"
import { Label } from "@radix-ui/react-label"
import Avatar from "@/app/components/Avatar"
import { Cross2Icon } from "@radix-ui/react-icons"
import { DialogClose } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/ui/icons"

type Props = {
    users: User[] | null
}

const GroupFormSchema = z.object({
    groupName: z.string({ required_error: 'Group must have name' }),
    members: z.array(z.object({
        id: z.string(),
        name: z.string(),
        image: z.string(),
        email: z.string().email(),
    })).min(2, { message: 'A group must have at least 3 members including you.' })
})

export default function GroupChatModal({ users }: Props) {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [searchText, setSearchText] = useState('')
    const [open, setOpen] = useState(false);

    const { toast } = useToast();

    const form = useForm<z.infer<typeof GroupFormSchema>>({
        resolver: zodResolver(GroupFormSchema),
        defaultValues: {
            groupName: '',
            members: []
        }
    })

    useEffect(() => {
        form.reset();
    }, [])

    const members = form.watch('members')

    async function onSubmit(values: z.infer<typeof GroupFormSchema>) {
        setIsLoading(true);

        const { groupName: name, members } = values;

        try {
            const res = await fetch(`/api/conversations`, {
                method: 'POST',
                body: JSON.stringify({
                    name,
                    members,
                    isGroup: true,
                })
            })

            if (!res.ok) throw new Error('Failed to create group chat');

            if (res.ok) {
                form.reset();
                setOpen(false);
            }

        } catch (e) {
            if (e instanceof Error) {
                return toast({
                    title: 'Error creating group chat',
                    description: e.message,
                    variant: 'destructive'
                })
            }
            return toast({
                title: 'Error creating group chat',
                description: 'Something went wrong',
                variant: 'destructive'
            })
        } finally {
            setIsLoading(false);
        }
    }


    const setMembers = (id: string, name: string, image: string, email: string) => {
        if (members.some(u => u.id === id)) {
            form.setValue('members', members.filter(u => u.id !== id), { shouldValidate: true })
        } else {
            form.setValue('members', [...members, { id, name, image, email }], { shouldValidate: true })
        }
    }

    const filteredUsers = (users: User[] | null): User[] => {
        if (!users) return []
        return users.filter(user => user.name?.toLocaleLowerCase()?.includes(searchText))
    }

    const content = (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        control={form.control}
                        name="groupName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Group Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="My Group" {...field} required />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <section>
                        <div className="mb-2">
                            <Label htmlFor="member_search" className="text-sm mt-8 mb-2">Select members:<span className="text-xs text-muted-foreground">&nbsp;Select at least 2</span></Label>
                        </div>
                        <Input type="text" placeholder={"Search people"} id="member_search" className="mb-5" value={searchText} onChange={e => setSearchText(e.target.value)} />
                        {members.length > 0 && <section className="mb-5 flex gap-4 max-w-full overflow-x-auto">
                            {
                                members.map((user) => {
                                    let name = user?.name?.split(' ')[0]
                                    name = name.length > 7 ? `${name.slice(0, 7)}...` : name

                                    return (
                                        <div className="relative flex flex-col items-center cursor-pointer justify-center gap-1" key={user.id} onClick={() => setMembers(user.id, user?.name!, user?.image!, user?.email!)}>
                                            <Avatar user={user} className="h-10 w-10" />
                                            <span className="text-xs text-light">{name}</span>
                                            <span className="absolute -top-2 -right-2 rounded-[50%] bg-background p-1">
                                                <Cross2Icon className="h-3 w-3" />
                                            </span>
                                        </div>
                                    )
                                })
                            }
                        </section>}

                        <UsersSelect users={filteredUsers(users)} selected={members} setMembers={setMembers} />
                    </section>

                    <section className="flex justify-end mt-8 gap-4">
                        <DialogClose asChild>
                            <Button variant="outline" type="button">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" className="disabled:cursor-not-allowed" disabled={isLoading || (members.length < 2)} onClick={() => onSubmit({ groupName: form.getValues('groupName'), members: form.getValues('members') })}>
                            {isLoading ? (
                                <>
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            )
                                : 'Create'}
                        </Button>
                    </section>
                </form>
            </Form>
        </>
    )


    return (
        <CustomDialog title={'Create a group chat'} content={content} description="Chat with more than 2 people" open={open} setOpen={setOpen}>
            <Button variant="outline" size="icon" className="text-xl" title="Create a group chat">
                <MdOutlineGroupAdd />
            </Button>
        </CustomDialog>
    )
}