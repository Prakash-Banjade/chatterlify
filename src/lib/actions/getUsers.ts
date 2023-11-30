import prisma from '../prismadb'
import getSession from './getSession'

export default async function getUsers() {
    const session = await getSession()
    if (!session?.user?.email) {
        return null
    }

    try {
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            where: {
                NOT: {
                    email: session?.user?.email
                }
            }
        })

        return users;

    } catch (e) {
        if (e instanceof Error) {
            console.log(e.message)
        }

        return null;
    }
}