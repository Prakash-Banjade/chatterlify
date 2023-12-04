import getUsers from "@/lib/actions/getUsers";
import Sidebar from "../components/sidebar/Sidebar";
import UsersList from "../components/UsersList";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: `Users | ${process.env.APP_NAME}`,
    description: 'Here you will find all the users connected to this app.'
}

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