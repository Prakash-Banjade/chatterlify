import getConversations from "@/lib/actions/getConversations";
import Sidebar from "../components/sidebar/Sidebar";
import ConversationLIst from "./components/ConversationLIst";

export default async function ConversationsLayout({
    children
}: {
    children: React.ReactNode,
}) {

    const conversations = await getConversations();
    
    return (
        <Sidebar>
            <div className="lg:pl-20 h-full">
                <ConversationLIst
                    initialItems={conversations}
                />
                {children}
            </div>
        </Sidebar>
    )
}