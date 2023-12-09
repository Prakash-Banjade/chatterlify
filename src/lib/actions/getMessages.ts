import prisma from '../prismadb'

export default async function getMessages(conversationId: string) {
    try {
        const messages = await prisma.message.findMany({
            where: {
                conversationId: conversationId,
            },
            include: {
                sender: true,
                seen: true,
                reactions: {
                    include: {
                        user: true
                    }
                }
            },
            orderBy: {
                createdAt: 'asc',
            }
        })

        return messages;

    } catch (e) {
        if (e instanceof Error) {
            console.log(e.message)
            throw new Error('Error getting messages')
        }
        throw new Error('Error getting messages')
    }
}