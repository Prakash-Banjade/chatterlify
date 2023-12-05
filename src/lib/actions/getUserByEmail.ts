import prisma from '../prismadb'

export async function getUserByEmail(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email,
            }
        })

        return user;
    } catch (e) {
        if (e instanceof Error) {
            console.log(e.message)
            throw new Error('Error displaying users')
        }
        throw new Error('Error displaying users')
    }
}