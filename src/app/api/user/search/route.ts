import getCurrentUser from "@/lib/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prismadb'
import getUsers from "@/lib/actions/getUsers";

export async function GET(req: NextRequest) {
    try {
        const params = new URL(req.url).searchParams;
        const query = params.get('query');

        if (!query) {
            const allUsers = await getUsers();
            return NextResponse.json(allUsers)
        }

        const foundUsers = await prisma.user.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: query,
                            mode: 'insensitive'
                        }
                    },
                    {
                        name: {
                            contains: query.split(' ')[0],
                        }
                    },
                ]
            },
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

        return NextResponse.json({ users: foundUsers, hasNextPage: false });

    } catch (e) {
        if (e instanceof Error) return new NextResponse(e.message, { status: 500 })
        return new NextResponse('User Search: Internal Server Error', { status: 500 })
    }
}