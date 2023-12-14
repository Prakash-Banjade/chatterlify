import { User } from '@prisma/client';
import prisma from '../prismadb'
import getSession from './getSession'

export default async function getCurrentUser() {
    try {
        const session = await getSession();

        if (!session?.user?.email) {
            return null;
        }

        const currentUser = await prisma.user.findUnique({
            where: {
                email: session.user.email as string,
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

        if (!currentUser) return null;

        return currentUser;
    } catch (e) {
        return null;
    }
}