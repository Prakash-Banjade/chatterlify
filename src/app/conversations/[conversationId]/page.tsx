import EmptyState from "@/app/components/EmptyState";
import getConversationbyId from "@/lib/actions/getConversationById"
import getMessages from "@/lib/actions/getMessages";
import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/Form";
import getConversations from "@/lib/actions/getConversations";
import getCurrentUser from "@/lib/actions/getCurrentUser";
import DrawerContent from "./components/DrawerContent";

type Params = {
    conversationId: string,
}

export async function generateMetadata({ params }: { params: Params }) {
    const conversation = await getConversationbyId(params.conversationId);

    if (conversation?.isGroup) {
        return {
            title: `Chat - ${conversation.name} | ${process.env.APP_NAME}`,
        }
    }

    if (conversation?.users.length === 2) {
        return {
            title: `Chat - ${conversation?.users[1]?.name} | ${process.env.APP_NAME}`
        }
    }
}

export default async function ConversationId({ params }: { params: Params }) {

    const conversation = await getConversationbyId(params.conversationId);
    const messages = await getMessages(params.conversationId);
    const currentUser = await getCurrentUser()

    if (!conversation) {
        return <div className="lg:pl-80 h-full">
            <div className="h-full flex flex-col">
                <EmptyState />
            </div>
        </div>
    }

    return (
        <div className="lg:pl-80 h-full flex">
            <div className="h-full flex flex-col 2xl:basis-[70%] grow">
                <Header conversation={conversation} />
                <Body initialMessages={messages} currentUser={currentUser!} />
                <Form />
            </div>
            <div className="hidden border-l border-border w-fit px-4 2xl:flex grow">
                <DrawerContent data={conversation} />
            </div>
        </div>
    )
}

// // For SSG
// export async function generateStaticParams() {
//     const conversations = await getConversations();

//     return conversations.map(conversation => ({
//         conversationId: conversation.id.toString()
//     }))
// }
