import getCurrentUser from "@/lib/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prismadb'
import getConversations from "@/lib/actions/getConversations";

export async function GET(req: NextRequest) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser?.id || !currentUser?.email) return new NextResponse('Unauthorized', { status: 401 })

        const params = new URL(req.url).searchParams;
        const query = params.get('query');

        if (!query) {
            const allConversations = await getConversations();
            return NextResponse.json(allConversations)
        }

        const conversations = await prisma.conversation.findMany({
            where: {
                userIds: { has: currentUser.id },
                OR: [
                    { name: { contains: query, mode: 'insensitive' } }, // Search by group name
                    {
                        users: {
                            some: {
                                name: { contains: query, mode: 'insensitive' }, // Search by other user's name in one-to-one conversations
                            },
                        },
                    },
                    {
                        users: {
                            some: {
                                name: { contains: query.split(' ')[0], mode: 'insensitive' },
                            },
                        },
                    },
                ],
            },
            include: {
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
                },
            },
        });

        return NextResponse.json({ conversations: conversations, hasNextPage: false });

    } catch (e) {
        if (e instanceof Error) return new NextResponse(e.message, { status: 500 })
        return new NextResponse('User Search: Internal Server Error', { status: 500 })
    }
}