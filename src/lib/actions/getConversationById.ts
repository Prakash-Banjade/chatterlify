import prisma from '../prismadb'
import getCurrentUser from './getCurrentUser'

export default async function getConversationbyId(conversationId: string) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser?.email) return null;

        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                messages: {
                    include: {
                        sender: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                image: true,
                                bio: true,
                                socialLinks: true,
                                createdAt: true,
                                updatedAt: true,
                            }
                        },
                        seen: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                image: true,
                                bio: true,
                                socialLinks: true,
                                createdAt: true,
                                updatedAt: true,
                            }
                        }
                    }
                },
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        bio: true,
                        socialLinks: true,
                        createdAt: true,
                        updatedAt: true,
                    }
                }
            }
        })

        return conversation;
    } catch (e) {
        if (e instanceof Error) throw new Error(e.message)
        return null;
    }
}