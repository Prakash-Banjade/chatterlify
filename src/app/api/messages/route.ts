import getCurrentUser from "@/lib/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prismadb'
import { pusherServer } from "@/lib/pusher";

export async function POST(req: NextRequest) {
    try {
        const currentUser = await getCurrentUser();
        const { message, image, conversationId } = await req.json();

        if (!currentUser?.id || !currentUser?.email) return new NextResponse('Unauthorized', { status: 401 })

        const newMessage = await prisma.message.create({
            data: {
                body: message,
                image: image,
                conversation: {
                    connect: {
                        id: conversationId,
                    }
                },
                sender: {
                    connect: {
                        id: currentUser.id,
                    }
                },
                seen: {
                    connect: {
                        id: currentUser.id,
                    }
                },
            },
            include: {
                seen: {
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
                },
                sender: {
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
                },
            }
        })

        const updatedConversation = await prisma.conversation.update({
            where: {
                id: conversationId,
            },
            data: {
                lastMessageAt: new Date(),
                messages: {
                    connect: {
                        id: newMessage.id,
                    }
                }
            },
            include: {
                users: true,
                messages: {
                    include: {
                        seen: {
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
                        },
                        sender: {
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
                        },
                    }
                }
            }
        })

        await pusherServer.trigger(conversationId, 'messages:new', newMessage);
        const lastMessage = updatedConversation.messages.at(-1);

        updatedConversation.users.map(user => {
            // if (user?.email && lastMessage) {
            pusherServer.trigger(user.email!, 'conversation:update', {
                id: conversationId,
                messages: [lastMessage],
            })
            // }
        })

        return NextResponse.json(newMessage)
    } catch (e) {
        if (e instanceof Error) return new NextResponse(e.message, { status: 500 })
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const currentUser = await getCurrentUser();
        const { messageId, conversationId } = await req.json();

        if (!currentUser?.id || !currentUser?.email) return new NextResponse('Unauthorized', { status: 401 })
        if (!messageId || !conversationId) return new NextResponse('messageId & conversationId are required', { status: 400 })

        const messageToDelete = await prisma.message.findUnique({
            where: {
                id: messageId
            }
        })

        if (!messageToDelete) return new NextResponse('Message not found', { status: 404 })
        if (messageToDelete.senderId !== currentUser.id) return new NextResponse('Unauthorized', { status: 401 })

        const deletedMessage = await prisma.message.delete({
            where: {
                id: messageId,
            },
            include: {
                sender: true,
                seen: true,
                reactions: {
                    include: {
                        user: {
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
                        },
                    }
                }
            }
        });

        await pusherServer.trigger(conversationId, 'messages:delete', deletedMessage.id);

        return NextResponse.json(deletedMessage)

    } catch (e) {
        console.log(e)
        if (e instanceof Error) return new NextResponse(e.message, { status: 500 })
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}