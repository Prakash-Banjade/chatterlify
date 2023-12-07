import getConversations from "@/lib/actions/getConversations";
import Sidebar from "../components/sidebar/Sidebar";
import ConversationLIst from "./components/ConversationLIst";
import getUsers from "@/lib/actions/getUsers";
import { Metadata } from "next";
import getCurrentUser from "@/lib/actions/getCurrentUser";

export const metadata: Metadata = {
    title: `Conversation | ${process.env.APP_NAME}`,
    description: `Here you will find you all ongoing conversations with other users.`,
}

export default async function ConversationsLayout({
    children
}: {
    children: React.ReactNode,
}) {

    const conversations = await getConversations();
    const users = await getUsers();
    const currentUser = await getCurrentUser();

    return (
        <Sidebar>
            <div className="lg:pl-20 h-full">
                <ConversationLIst
                    initialItems={conversations}
                    users={users}
                    currentUser={currentUser!}
                />
                {children}
            </div>
        </Sidebar>
    )
}