import prisma from '../prismadb'
import getCurrentUser from './getCurrentUser'

export default async function getConversations() {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) { // a little different approach
        throw new Error('Not authorized')
    }

    try {
        const conversations = await prisma.conversation.findMany({
            orderBy: {
                lastMessageAt: 'desc'
            },
            where: {
                userIds: {
                    has: currentUser.id
                }
            },
            include: {
                users: true,
                messages: {
                    include: {
                        sender: true,
                        seen: true,
                    }
                }
            }
        })

        return conversations;
    } catch (e) {
        if (e instanceof Error) throw new Error(e.message)
        throw new Error('Something went wrong')
    }
}
