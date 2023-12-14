import prisma from "@/lib/prismadb";
import getCurrentUser from "./getCurrentUser";
import { FullConversation } from "../../../types";

export interface GetConversationsProps {
    conversations: FullConversation[]
    hasNextPage: boolean
}

const getConversations = async (page: number = 1, limit: number = 10): Promise<GetConversationsProps> => {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
        return {
            conversations: [],
            hasNextPage: false,
        };
    }

    const skip = (page - 1) * limit;

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
            },
            skip: skip,
            take: limit,
        });

        const totalConversations = await prisma.conversation.count({
            where: {
                userIds: {
                    has: currentUser.id
                }
            },
        })

        const hasNextPage = page * limit < totalConversations;

        return {
            conversations: conversations,
            hasNextPage,
        };
    } catch (error: any) {
        return {
            conversations: [],
            hasNextPage: false,
        };
    }
};

export default getConversations;