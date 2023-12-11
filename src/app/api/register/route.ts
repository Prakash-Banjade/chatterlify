import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import prisma from '@/lib/prismadb'


export async function POST(
    req: NextRequest,
) {

    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return new NextResponse('Missing fields', { status: 400 })
        }

        const foundUser = await prisma.user.findUnique({
            where: {
                email,
            },
        })

        if (foundUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 409 })
        }

        const hashedPwd = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                hashedPassword: hashedPwd,
            }
        })

        return NextResponse.json({ message: 'User created successfully', user }, { status: 201 })
    } catch (e) {
        if (e instanceof Error) {
            return new NextResponse(e.message, { status: 500 })
        }
    }
}