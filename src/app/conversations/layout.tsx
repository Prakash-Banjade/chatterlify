import getConversations from "@/lib/actions/getConversations";
import Sidebar from "../components/sidebar/Sidebar";
import ConversationLIst from "./components/ConversationLIst";
import getUsers from "@/lib/actions/getUsers";
import { Metadata } from "next";
import getCurrentUser from "@/lib/actions/getCurrentUser";
import ConversationList_wrapper from "./components/ConversationList_wrapper";
import { Suspense } from "react";
import UsersLoading from "../components/sidebar/UsersLoading";

export const metadata: Metadata = {
    title: `Conversation | ${process.env.APP_NAME}`,
    description: `Here you will find you all ongoing conversations with other users.`,
}

export default async function ConversationsLayout({
    children
}: {
    children: React.ReactNode,
}) {

    return (
        <Sidebar>
            <div className="lg:pl-20 h-full">
                <Suspense fallback={<UsersLoading variant="chats" />}>
                    <ConversationList_wrapper />
                </Suspense>
                {children}
            </div>
        </Sidebar>
    )
}