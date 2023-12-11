import Avatar from "@/app/components/Avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { User } from "@prisma/client"

type Props = {
    users: Partial<User>[] | null,
    selected: {
        image: string,
        id: string,
        name: string,
        email: string,
    }[],
    setMembers: (id: string, name: string, image: string, email: string) => void,
}

export default function UsersSelect({ users, selected, setMembers }: Props) {

    const handleSelect = (user: Partial<User>) => {
        setMembers(user.id!, user.name!, user.image!, user.email!)
    }

    if (!users || !users.length) return (
        <div className="mt-5 text-sm text-muted-foreground">
            No other users
        </div>
    )

    return (
        <div className="flex flex-col max-h-[200px] overflow-y-auto mt-5">
            {
                users?.map(user => (
                    <div className="flex items-center justify-between hover:bg-backgroundSecondary px-3 py-2 rounded-md" key={user?.id}>
                        <section className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => handleSelect(user)}>
                            <Avatar user={user} />
                            <span className="text-sm">{user?.name}</span>
                        </section>
                        <Checkbox checked={selected.some(u => u.id === user.id)} onClick={() => handleSelect(user)} />
                    </div>
                ))
            }
        </div>
    )
}