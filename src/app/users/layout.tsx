import getUsers from "@/lib/actions/getUsers";
import Sidebar from "../components/sidebar/Sidebar";
import UsersList from "../components/UsersList";

export default async function UsersLayout(
    { children }: { children: React.ReactNode }
) {

    const users = await getUsers();

    return (
        <Sidebar>
            <main className="lg:pl-20 h-full">
                <UsersList users={users} />
                {children}
            </main>
        </Sidebar>
    )
}