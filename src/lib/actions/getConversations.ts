import prisma from "@/lib/prismadb";
import getCurrentUser from "./getCurrentUser";

const getConversations = async () => {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
        return [];
    }

    try {
        const conversations = await prisma.conversation.findMany({
            orderBy: {
                lastMessageAt: 'desc',
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
                        },
                        reactions: {
                            include: {
                                user: {
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
                            }
                        }
                    }
                },
            }
        });

        return conversations;
    } catch (error: any) {
        return [];
    }
};

export default getConversations;