import getUsers from "@/lib/actions/getUsers";
import ConversationLIst from "./ConversationLIst";

export default async function ConversationList_wrapper() {
    const users = await getUsers()

    return (
        <ConversationLIst users={users} />
    )
}
