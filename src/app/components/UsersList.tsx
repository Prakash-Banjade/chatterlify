import { User } from "@prisma/client";
import UserBox from "./UserBox";

export default function UsersList({ users }: { users: User[] | null }) {
    return (
        <aside className="fixed inset-y-0 pb-20 lg:bg-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r w-full left-0">

            <div className="px-5 mb-4 pt-4">
                <div className="flex-col flex">
                    <h2 className="text-2xl font-semibold">Users</h2>
                    <section className="flex flex-col gap-2">
                        {users?.map((user) => (
                            <UserBox key={user.id} user={user} />
                        ))}
                    </section>
                </div>
            </div>

        </aside>
    )
}