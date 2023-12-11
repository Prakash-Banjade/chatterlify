import getUsers from "@/lib/actions/getUsers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const params = new URL(req.url).searchParams;
        const page = Number(params.get('page')) || 1
        const limit = Number(params.get('limit')) || 10

        const result = await getUsers(page, limit);

        return NextResponse.json(result)

    } catch (e) {
        if (e instanceof Error) return new NextResponse(e.message, { status: 500 })
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}