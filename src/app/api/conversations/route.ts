import getCurrentUser from "@/lib/actions/getCurrentUser";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { pusherServer } from "@/lib/pusher";
import getConversations from "@/lib/actions/getConversations";

export async function GET(req: NextRequest) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const params = new URL(req.url).searchParams;
        const page = Number(params.get('page')) || 1
        const limit = Number(params.get('limit')) || 10

        const result = await getConversations(page, limit);

        return NextResponse.json(result);
        
    } catch (e) {
        if (e instanceof Error) return new NextResponse(e.message, { status: 500 })
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const currentUser = await getCurrentUser();
        const { userId, isGroup, members, name } = await req.json();

        if (!currentUser?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (isGroup && (!members || members.length < 2 || !name)) {
            return new NextResponse("Invalid data", { status: 400 });
        }

        // for group chat we don't need to check if the group chat with same members exists or not bcz there can be several group with same members
        if (isGroup) {
            const newConversation = await prisma.conversation.create({
                data: {
                    name,
                    isGroup,
                    users: {
                        connect: [
                            ...members.map((member: { id: string }) => ({
                                id: member.id
                            })),
                            {
                                id: currentUser.id // our own id isn't sent because we are the one who created group and own id can't be selected in frontend, so define own id explicitly
                            }
                        ]
                    }
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
                    }
                }
            });

            // Update all connections with new conversation
            newConversation.users.forEach(user => {
                if (user.email) {
                    pusherServer.trigger(user.email, 'conversation:new', newConversation)
                }
            })

            return NextResponse.json(newConversation);
        }

        // for one-to-one conversation we do need to check if the conversation exists
        const existingConversation = await prisma.conversation.findMany({
            where: {
                OR: [
                    {
                        userIds: {
                            equals: [currentUser.id, userId]
                        }
                    },
                    {
                        userIds: {
                            equals: [userId, currentUser.id]
                        }
                    }
                ]
            }
        })

        const singleConversation = existingConversation[0];

        if (singleConversation) {
            return NextResponse.json(singleConversation);
        }

        const newConversation = await prisma.conversation.create({
            data: {
                users: {
                    connect: [
                        {
                            id: currentUser.id
                        },
                        {
                            id: userId
                        }
                    ]
                }
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
                }
            }
        })

        newConversation.users.map(user => {
            if (user.email) {
                pusherServer.trigger(user.email, 'conversation:new', newConversation)
            }
        })

        return NextResponse.json(newConversation);

    } catch (e) {
        if (e instanceof Error) return new NextResponse(e.message, { status: 500 })
        return new NextResponse('Internal Error', { status: 500 })
    }
}

