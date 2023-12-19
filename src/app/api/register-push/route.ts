import getCurrentUser from "@/lib/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import { PushSubscription } from "web-push";
import prisma from "@/lib/prismadb";

export async function POST(req: NextRequest) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser?.id || !currentUser?.email) return new NextResponse('Unauthorized', { status: 401 })

        const newSubscription: PushSubscription | undefined = await req.json();

        if (!newSubscription) return NextResponse.json({ message: 'Missing push subscription in body' }, { status: 400 })

        const userSubscriptions = currentUser.subscription || []

        const updatedSubscriptions = userSubscriptions.filter(sub => sub.endpoint !== newSubscription.endpoint); // ensuring no duplicates

        const newSubscriptionData = await prisma.subscription.create({
            data: {
                endpoint: newSubscription.endpoint,
                userId: currentUser.id,
            }
        })

        updatedSubscriptions.push(newSubscriptionData)

        const updatedUser = await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                subscription: {
                    disconnect: userSubscriptions.map(sub => ({ id: sub.id })),
                    connect: updatedSubscriptions.map(sub => ({ id: sub.id })),
                }
            }
        })

        return NextResponse.json({ message: 'push subscription saved' });


    } catch (e) {
        if (e instanceof Error) return new NextResponse(e.message, { status: 500 })
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser?.id || !currentUser?.email) return new NextResponse('Unauthorized', { status: 401 })

        const subscription: PushSubscription | undefined = await req.json();

        if (!subscription) return NextResponse.json({ message: 'Missing push subscription in body' }, { status: 400 })

        const existingSubscription = await prisma.subscription.findFirst({
            where: {
                userId: currentUser.id,
                endpoint: subscription.endpoint
            }
        })

        const updatedUser = await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                subscription: {
                    update: {
                        where: {
                            id: existingSubscription?.id,
                            endpoint: subscription.endpoint
                        },
                        data: {}
                    }
                }
            }
        })

        return NextResponse.json({ message: 'push subscription deleted' });

    } catch (e) {
        if (e instanceof Error) return new NextResponse(e.message, { status: 500 })
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}