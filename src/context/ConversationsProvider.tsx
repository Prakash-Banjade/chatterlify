'use client'

import { useContext, createContext, useState, ReactNode, Dispatch, SetStateAction } from "react";
import { FullConversation } from "../../types";

interface CurrentConversationsContextType {
    items: FullConversation[];
    setItems: Dispatch<SetStateAction<FullConversation[]>>;
}

const CurrentConversationsContext = createContext<CurrentConversationsContextType>({
    items: [],
    setItems: () => { },
});

interface CurrentConversationProviderProps {
    initialItems: FullConversation[],
    children: ReactNode;
}

export default function CurrentConversationProvider({ initialItems, children }: CurrentConversationProviderProps) {
    const [items, setItems] = useState<FullConversation[]>(initialItems);

    const contextValue: CurrentConversationsContextType = {
        items,
        setItems,
    };

    return (
        <CurrentConversationsContext.Provider value={contextValue}>
            {children}
        </CurrentConversationsContext.Provider>
    );
}

export function useCurrentConversations() {
    return useContext(CurrentConversationsContext);
}
