import getUsers from "@/lib/actions/getUsers";
import UsersList from "./UsersList";

export default async function UsersList_wrapper() {

    const { users, hasNextPage } = await getUsers();

    return (
        <UsersList users={users} hasNextPage={hasNextPage} />
    )
}
