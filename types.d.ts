import { Conversation, Message, Reaction, User } from '@prisma/client'

export type FullReaction = Reaction & {
    user: User,
}

export type FullMessage = Message & {
    sender: User,
    seen: User[],
    reactions: FullReaction[]
}

export type FullConversation = Conversation & {
    users: User[],
    messages: FullMessage[],
}