import getCurrentUser from "@/lib/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { pusherServer } from "@/lib/pusher";

type Params = {
    conversationId: string,
    messageId: string,
}

export async function POST(req: NextRequest, { params }: { params: Params }) {
    try {

        const currentUser = await getCurrentUser();
        const { conversationId, messageId } = params;
        const { reaction } = await req.json();

        if (!currentUser?.id || !currentUser?.email) return new NextResponse('Unauthorized', { status: 401 })
        if (!conversationId) return new NextResponse('invalid conversation id', { status: 400 })

        const message = await prisma.message.findUnique({
            where: {
                id: messageId
            },
            include: {
                sender: true,
                seen: true,
                reactions: {
                    include: {
                        user: true
                    }
                }
            }
        })

        // checking if the the user has previous reaction
        const existingReaction = message?.reactions.find(reaction => reaction.user.id === currentUser.id)

        if (existingReaction) {
            const updatedReaction = await prisma.reaction.update({
                where: {
                    id: existingReaction.id,
                    messageId,
                },
                data: {
                    reaction,
                },
                include: {
                    user: true
                }
            })
            const updatedMessage = await prisma.message.findUnique({
                where: {
                    id: updatedReaction.messageId
                },
                include: {
                    seen: true,
                    sender: true,
                    reactions: {
                        include: {
                            user: true,
                        }
                    }
                }
            })
            await pusherServer.trigger(conversationId, 'messages:reaction', {
                messageId: updatedReaction.messageId,
                reactions: updatedMessage?.reactions,
            })

            return NextResponse.json(updatedMessage)
        }

        const newReaction = await prisma.reaction.create({
            data: {
                reaction,
                message: {
                    connect: {
                        id: messageId,
                    }
                },
                user: {
                    connect: {
                        id: currentUser.id
                    }
                }
            },
            include: {
                user: true,
            }
        })

        const updatedMessage = await prisma.message.update({
            where: {
                id: messageId,
            },
            data: {
                reactions: {
                    connect: {
                        id: newReaction.id
                    }
                }
            },
            include: {
                seen: true,
                sender: true,
                reactions: {
                    include: {
                        user: true
                    }
                }
            }
        })

        await pusherServer.trigger(conversationId, 'messages:reaction', {
            messageId: newReaction.messageId,
            reactions: updatedMessage?.reactions,
        })

        return NextResponse.json(updatedMessage)

    } catch (e) {
        console.error(e)
        if (e instanceof Error) return new NextResponse(e.message, { status: 500 })
        return new NextResponse('Internal server error', { status: 500 })
    }
}