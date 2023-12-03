import EmptyState from "@/app/components/EmptyState";
import getConversationbyId from "@/lib/actions/getConversationById"
import getMessages from "@/lib/actions/getMessages";
import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/Form";

type Params = {
    conversationId: string,
}

export default async function ConversationId({ params }: { params: Params }) {

    const conversation = await getConversationbyId(params.conversationId);
    const messages = await getMessages(params.conversationId);

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