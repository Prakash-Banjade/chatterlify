import getCurrentUser from "@/lib/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

type Params = {
    conversationId: string
}

export async function POST(req: NextRequest, { params }: { params: Params }) {
    try {
        const currentUser = await getCurrentUser();
        const { conversationId } = params;

        if (!currentUser?.id || !currentUser?.email) return new NextResponse('Unauthorized', { status: 401 })

        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: {
                messages: {
                    include: {
                        seen: true
                    }
                },
                users: true,
            },
        })

        if (!conversation) return new NextResponse('Invalid conversatino ID', { status: 404 })

        // find the last message
        const lastMessage = conversation.messages.at(-1); // different approach

        if (!lastMessage) return NextResponse.json(conversation)

        // update seen of last message
        const updatedMessage = await prisma.message.update({
            where: {
                id: lastMessage.id,
            },
            data: {
                seen: {
                    connect: {
                        id: currentUser.id,
                    }
                }
            },
            include: {
                seen: true,
                sender: true,
            }
        })

        return NextResponse.json(updatedMessage);

    } catch (e) {
        console.error(e)
        if (e instanceof Error) return new NextResponse(e.message, { status: 500 })
        return new NextResponse('Internal server error', { status: 500 })
    }
}