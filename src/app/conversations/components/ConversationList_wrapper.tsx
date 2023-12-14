import getUsers from "@/lib/actions/getUsers";
import ConversationLIst from "./ConversationLIst";
import getConversations from "@/lib/actions/getConversations";

export default async function ConversationList_wrapper() {
    const result = await getUsers() // only 10 users, but needed all users used in Group chat modal
    const initialState = await getConversations();

    return (
        <ConversationLIst users={result.users} initialState={initialState} />
    )
}
