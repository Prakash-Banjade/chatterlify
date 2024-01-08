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

        const isDuplicateEndpoint = currentUser.Subscription.some(
            (sub) => sub.endpoint === newSubscription.endpoint
        );

        if (!isDuplicateEndpoint){
            const newSubscriptionData = await prisma.subscription.create({
                data: {
                    endpoint: newSubscription.endpoint,
                    userId: currentUser.id
                }
            })

            const updatedUser = await prisma.user.update({
                where: {
                    id: currentUser.id
                },
                data: {
                    Subscription: {
                        connect: newSubscriptionData
                    }
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
                    Subscription: true
                }
            })
            return NextResponse.json({ message: 'push subscription saved', updatedUser });
        }

        return NextResponse.json({message: 'Duplicate endpoint, handled accordingly'})



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

        const existingSubscription = currentUser.Subscription.find(sub => sub.endpoint === subscription.endpoint)

        if (!existingSubscription) return NextResponse.json({message: 'Invalid subscription remove request'}, {status: 400})

        const updatedUser = await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                Subscription: {
                    delete: {
                        id: existingSubscription.id
                    }
                }
            }
        })

        return NextResponse.json({ message: 'push subscription deleted', updatedUser });

    } catch (e) {
        if (e instanceof Error) return new NextResponse(e.message, { status: 500 })
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}