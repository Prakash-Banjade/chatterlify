import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prismadb'

type Params = {
    userId: string,
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
    try {
        const { userId } = params;
        if (!userId) return new NextResponse('User ID is required', { status: 400 })

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            }
        })

        if (!user) return new NextResponse('User not found', { status: 404 })

        return NextResponse.json(user);

    } catch (e) {
        if (e instanceof Error) return new NextResponse(e.message, { status: 500 })
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}