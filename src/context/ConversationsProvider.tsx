'use client'

import { useContext, createContext, useState, ReactNode, Dispatch, SetStateAction } from "react";
import { GetConversationsProps } from "@/lib/actions/getConversations";


interface CurrentConversationValue {
    conversationState: GetConversationsProps,
    setConversationState: Dispatch<SetStateAction<GetConversationsProps>>;
}

const CurrentConversationsContext = createContext<CurrentConversationValue>({
    conversationState: {
        conversations: [],
        hasNextPage: false,
    },
    setConversationState: () => { }
});

interface CurrentConversationProviderProps {
    initialState: GetConversationsProps,
    children: ReactNode;
}

export default function CurrentConversationProvider({ initialState, children }: CurrentConversationProviderProps) {
    const [conversationState, setConversationState] = useState(initialState)

    const contextValue: CurrentConversationValue = {
        conversationState,
        setConversationState
    }

    return (
        <CurrentConversationsContext.Provider value={contextValue}>
            {children}
        </CurrentConversationsContext.Provider>
    );
}

export function useCurrentConversations() {
    return useContext(CurrentConversationsContext);
}
