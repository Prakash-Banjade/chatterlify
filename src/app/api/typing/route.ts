import getCurrentUser from "@/lib/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";


export async function POST(req: NextRequest) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser?.email || !currentUser?.id) return

        const { conversationId } = await req.json()

        if (!conversationId) return;

        await pusherServer.trigger(conversationId, 'message:typing', currentUser)

        return NextResponse.json(currentUser)



    } catch (e) {
        if (e instanceof Error) return new NextResponse(e.message, { status: 500 })
        return new NextResponse('Settings: Internal Server Error', { status: 500 })
    }
}