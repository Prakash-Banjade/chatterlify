import { Conversation, Message, Reaction, User } from '@prisma/client'

export type FullReaction = Reaction & {
    user: Partial<User>,
}

export type FullMessage = Message & {
    sender: Partial<User>,
    seen: Partial<User>[],
    reactions: FullReaction[]
}

export type FullConversation = Conversation & {
    users: Partial<User>[],
    messages: Partial<FullMessage>[],
}