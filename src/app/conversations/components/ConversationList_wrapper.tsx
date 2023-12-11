import getUsers from "@/lib/actions/getUsers";
import ConversationLIst from "./ConversationLIst";

export default async function ConversationList_wrapper() {
    const result = await getUsers()

    return (
        <ConversationLIst users={result.users} />
    )
}
