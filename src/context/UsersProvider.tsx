'use client'

import { useContext, createContext, useState, ReactNode, Dispatch, SetStateAction } from "react";
import { GetUsersProps } from "@/lib/actions/getUsers";


interface CurrentUsersValue {
    usersState: GetUsersProps,
    setUsersState: Dispatch<SetStateAction<GetUsersProps>>;
}

const CurrentUsersContext = createContext<CurrentUsersValue>({
    usersState: {
        users: [],
        hasNextPage: false,
    },
    setUsersState: () => { }
});

interface CurrentUsersProviderProps {
    initialState: GetUsersProps,
    children: ReactNode;
}

export default function CurrentUsersProvider({ initialState, children }: CurrentUsersProviderProps) {
    const [usersState, setUsersState] = useState(initialState)

    const contextValue: CurrentUsersValue = {
        usersState,
        setUsersState
    }

    return (
        <CurrentUsersContext.Provider value={contextValue}>
            {children}
        </CurrentUsersContext.Provider>
    );
}

export function useCurrentUsers() {
    return useContext(CurrentUsersContext);
}
