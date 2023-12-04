import getCurrentUser from "@/lib/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prismadb'
import { pusherServer } from "@/lib/pusher";

export async function POST(req: NextRequest) {
    try {
        const currentUser = await getCurrentUser();
        const { message, image, conversationId } = await req.json();

        if (!currentUser?.id || !currentUser?.email) return new NextResponse('Unauthorized', { status: 401 })

        const newMessage = await prisma.message.create({
            data: {
                body: message,
                image: image,
                conversation: {
                    connect: {
                        id: conversationId,
                    }
                },
                sender: {
                    connect: {
                        id: currentUser.id,
                    }
                },
                seen: {
                    connect: {
                        id: currentUser.id,
                    }
                },
            },
            include: {
                seen: true,
                sender: true,
            }
        })

        const updatedConversation = await prisma.conversation.update({
            where: {
                id: conversationId,
            },
            data: {
                lastMessageAt: new Date(),
                messages: {
                    connect: {
                        id: newMessage.id,
                    }
                }
            },
            include: {
                users: true,
                messages: {
                    include: {
                        seen: true,
                        sender: true,
                    }
                }
            }
        })

        await pusherServer.trigger(conversationId, 'messages:new', newMessage);
        const lastMessage = updatedConversation.messages.at(-1); // different approach

        updatedConversation.users.map(user => {
            pusherServer.trigger(user.email!, 'conversation:update', {
                id: conversationId,
                messages: [lastMessage],
            })
        })

        return NextResponse.json(newMessage)
    } catch (e) {
        if (e instanceof Error) return new NextResponse(e.message, { status: 500 })
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}