import getCurrentUser from "@/lib/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prismadb'

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
            }
        })

        // const updatedConversation = await prisma.conversation.update({
        //     where: {
        //         id: conversationId,
        //     },
        //     data: {
        //         lastMessageAt: new Date(),
        //         messages: {
        //             connect: {
        //                 id: newMessage.id,
        //             }
        //         }
        //     },
        //     include: {
        //         users: true,
        //         messages: {
        //             include: {
        //                 seen: true
        //             }
        //         }
        //     }
        // })

        return NextResponse.json(newMessage)
    } catch (e) {
        if (e instanceof Error) return new NextResponse(e.message, { status: 500 })
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}