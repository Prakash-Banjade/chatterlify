import {
    PersonIcon,
    ExitIcon,
    ChatBubbleIcon
} from '@radix-ui/react-icons'
import { signOut } from 'next-auth/react'

import useConversation from './useConversation'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react';

export default function useRoutes() {
    const pathname = usePathname();
    const { conversationId } = useConversation();

    const routes = useMemo(() => [
        {
            label: 'Chat',
            href: '/conversations',
            icon: ChatBubbleIcon,
            active: pathname === '/conversation' || !!conversationId
        },
        {
            label: 'Users',
            href: '/users',
            icon: PersonIcon,
            active: pathname === '/users'
        },
        {
            label: 'Logout',
            href: '#',
            onClick: () => signOut(),
            icon: ExitIcon
        }
    ], [pathname, conversationId])

    return routes;
}