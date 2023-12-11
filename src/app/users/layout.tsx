import Sidebar from "../components/sidebar/Sidebar";
import { Metadata } from "next";
import UsersList_wrapper from "../components/UsersList_wrapper";
import { Suspense } from "react";
import UsersLoading from "../components/sidebar/UsersLoading";

export const metadata: Metadata = {
    title: `Users | ${process.env.APP_NAME}`,
    description: 'Here you will find all the users connected to this app.'
}

export default async function UsersLayout(
    { children }: { children: React.ReactNode }
) {

    return (
        <Sidebar>
            <main className="lg:pl-20 h-full">
                <aside className="fixed inset-y-0 pb-20 lg:bg-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r w-full left-0">
                    <div className="mb-4 pt-4">
                        <div className="flex-col flex">
                            <h2 className=" px-4 text-2xl mb-4">Users</h2>
                            <Suspense fallback={<UsersLoading variant="users" />}>
                                <UsersList_wrapper />
                            </Suspense>
                        </div>
                    </div>
                </aside>
                {children}
            </main>
        </Sidebar>
    )
}