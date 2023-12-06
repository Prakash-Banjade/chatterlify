import getCurrentUser from "@/lib/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import prisma from "@/lib/prismadb";


export async function POST(req: NextRequest) {
    try {
        const currentUser = await getCurrentUser();
        const { oldPwd, newPwd } = await req.json();

        if (!currentUser?.id || !currentUser?.email) return new NextResponse('Unauthorized', { status: 401 })

        if (!currentUser?.hashedPassword) return new NextResponse('Failed to set password', { status: 204 });

        const pwdMatch = await bcrypt.compare(oldPwd, currentUser.hashedPassword);

        if (!pwdMatch) return new NextResponse('Incorrect password', { status: 400 })

        const samePassword = await bcrypt.compare(newPwd, currentUser.hashedPassword);

        if (samePassword) return new NextResponse('New password cannot be the same as old password', { status: 400 })

        const hashedPassword = await bcrypt.hash(newPwd, 10)


        const updatedUser = await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                hashedPassword,
            }
        })

        return NextResponse.json(updatedUser)

    } catch (e) {
        if (e instanceof Error) return new NextResponse(e.message, { status: 500 })
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}