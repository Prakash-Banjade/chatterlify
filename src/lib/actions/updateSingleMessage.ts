import { Prisma } from "@prisma/client";
import prisma from '@/lib/prismadb'

type Data = (Prisma.Without<Prisma.MessageUpdateInput, Prisma.MessageUncheckedUpdateInput> & Prisma.MessageUncheckedUpdateInput) | (Prisma.Without<Prisma.MessageUncheckedUpdateInput, Prisma.MessageUpdateInput> & Prisma.MessageUpdateInput)

export default async function updateSingleMessage(id: string, data: Data) {
    try {
        const updatedMessage = await prisma.message.update({
            where: {
                id: id,
            },
            data,
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
                }
            }
        })

        return updatedMessage;
    } catch (e) {
        if (e instanceof Error) {
            return e;
        }
        throw new Error('error updating message')
    }
}