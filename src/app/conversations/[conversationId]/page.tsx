import EmptyState from "@/app/components/EmptyState";
import getConversationbyId from "@/lib/actions/getConversationById"
import getMessages from "@/lib/actions/getMessages";
import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/Form";
import getConversations from "@/lib/actions/getConversations";

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

    console.log('conversatoin: ', conversation)

    if (!conversation) {
        return <div className="lg:pl-80 h-full">
            <div className="h-full flex flex-col">
                <EmptyState />
            </div>
        </div>
    }

    return (
        <div className="lg:pl-80 h-full">
            <div className="h-full flex flex-col">
                <Header conversation={conversation} />
                <Body initialMessages={messages} />
                <Form />
            </div>

        </div>
    )
}

// For SSG
export async function generateStaticParams() {
    const conversations = await getConversations();

    return conversations.map(conversation => ({
        conversationId: conversation.id.toString()
    }))
}
