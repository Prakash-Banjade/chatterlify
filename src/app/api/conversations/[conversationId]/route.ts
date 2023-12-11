import getCurrentUser from "@/lib/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prismadb'
import { pusherServer } from "@/lib/pusher";

type Params = {
    conversationId: string,
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
    try {
        const { conversationId } = params;
        const currentUser = await getCurrentUser();

        if (!currentUser?.id || !currentUser?.email) return new NextResponse('Unauthorized', { status: 401 })

        const existingConversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: {
                users: true
            }
        })

        if (!existingConversation) return new NextResponse('Invalid conversation ID', { status: 404 })


        const deletedConversation = await prisma.conversation.deleteMany({
            where: {
                id: conversationId,
                userIds: {
                    hasSome: [currentUser.id]
                }
            }
        })

        existingConversation.users.forEach(user => {
            if (user.email) {
                pusherServer.trigger(user.email, 'conversation:remove', existingConversation.id);
            }
        })

        return NextResponse.json(deletedConversation)

    } catch (e) {
        console.log(e)
        if (e instanceof Error) return new NextResponse(e.message, { status: 500 })
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}