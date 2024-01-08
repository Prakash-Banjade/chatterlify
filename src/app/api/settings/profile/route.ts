import getCurrentUser from "@/lib/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prismadb'
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser?.id || !currentUser?.email) return new NextResponse('Unauthorized', { status: 401 })

        const data = await req.json();

        const updatedUser = await prisma.user.update({
            where: {
                id: currentUser.id,
            },
            data,
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
        })

        revalidatePath('/settings')

        return NextResponse.json(updatedUser);

    } catch (e) {
        if (e instanceof Error) return new NextResponse(e.message, { status: 500 })
        return new NextResponse('Settings: Internal Server Error', { status: 500 })
    }
}