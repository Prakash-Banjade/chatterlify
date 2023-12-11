import { User } from '@prisma/client'
import prisma from '../prismadb'
import getSession from './getSession'

export type GetUsersProps = {
    users: Partial<User>[],
    hasNextPage: boolean
}

export default async function getUsers(page: number = 1, limit: number = 10): Promise<GetUsersProps> {
    const session = await getSession()
    if (!session?.user?.email) {
        return {
            users: [],
            hasNextPage: false
        };
    }

    const skip = (page - 1) * limit;

    try {
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            where: {
                NOT: {
                    email: session?.user?.email
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                bio: true,
                socialLinks: true,
                createdAt: true,
                updatedAt: true,
            },
            skip: skip,
            take: limit,
        })

        const totalUsers = await prisma.user.count();
        const hasNextPage = page * limit < totalUsers;

        return { users, hasNextPage };

    } catch (e) {
        if (e instanceof Error) {
            console.log(e.message)
        }

        return {
            users: [],
            hasNextPage: false
        };
    }
}