import {
    PersonIcon,
    ChatBubbleIcon,
    GearIcon
} from '@radix-ui/react-icons'

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
            label: 'Settings',
            href: '/settings',
            icon: GearIcon,
            active: !!pathname.includes('settings')
        },
    ], [pathname, conversationId])

    return routes;
}