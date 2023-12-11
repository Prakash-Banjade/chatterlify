import getCurrentUser from "@/lib/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import getConversationbyId from "@/lib/actions/getConversationById";
import updateSingleMessage from "@/lib/actions/updateSingleMessage";

type Params = {
    conversationId?: string
}

export async function POST(req: NextRequest, { params }: { params: Params }) {
    try {
        const currentUser = await getCurrentUser();
        const { conversationId } = params;

        if (!currentUser?.id || !currentUser?.email) return new NextResponse('Unauthorized', { status: 401 })

        if (!conversationId) return new NextResponse('conversation id required', { status: 400 })
        const conversation = await getConversationbyId(conversationId);

        if (!conversation) return new NextResponse('Invalid conversatino ID', { status: 404 })

        // find the last message
        const lastMessage = conversation.messages.at(-1); // different approach

        if (!lastMessage) return NextResponse.json(conversation)

        // update seen of last message
        const data = {
            seen: {
                connect: {
                    id: currentUser.id,
                }
            }
        }

        const updatedMessage = await updateSingleMessage(lastMessage.id, data)

        await pusherServer.trigger(currentUser.email, 'conversation:update', {
            id: conversationId,
            messages: [updatedMessage]
        })

        // if user has already seen the message no need to go further
        if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
            return NextResponse.json(conversation);
        }

        await pusherServer.trigger(conversationId!, 'message:update', updatedMessage);

        return new NextResponse('Success')

    } catch (e) {
        console.error(e)
        if (e instanceof Error) return new NextResponse(e.message, { status: 500 })
        return new NextResponse('Internal server error', { status: 500 })
    }
}