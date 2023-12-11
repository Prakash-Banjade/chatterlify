import getUsers from "@/lib/actions/getUsers";
import UsersList from "./UsersList";

export default async function UsersList_wrapper() {

    const users = await getUsers();

    return (
        <UsersList users={users} />
    )
}
