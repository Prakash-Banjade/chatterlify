import getCurrentUser from "@/lib/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prismadb'
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser?.id || !currentUser?.email) return new NextResponse('Unauthorized', { status: 401 })

        const { name, image } = await req.json();

        const updatedUser = await prisma.user.update({
            where: {
                id: currentUser.id,
            },
            data: {
                name,
                image,
            }
        })

        revalidatePath('/settings')

        return NextResponse.json(updatedUser);

    } catch (e) {
        if (e instanceof Error) return new NextResponse(e.message, { status: 500 })
        return new NextResponse('Settings: Internal Server Error', { status: 500 })
    }
}