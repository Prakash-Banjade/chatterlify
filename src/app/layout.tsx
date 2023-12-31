import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/context/ThemeProvider'
import { Toaster } from "@/components/ui/toaster"
import AuthProvider from '@/context/AuthProvider'
import NextTopLoader from 'nextjs-toploader';
import ActiveStatus from './components/ActiveStatus'
import { ActionHandler } from './action-handler'
import CurrentConversationProvider from '@/context/ConversationsProvider'
import getConversations from '@/lib/actions/getConversations'
import CurrentUsersProvider from '@/context/UsersProvider'
import getUsers from '@/lib/actions/getUsers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: `${process.env.APP_NAME} - your chat matters`,
  description: 'Chat with your connections',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const result = await getConversations();
  const usersState = await getUsers();


  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <CurrentConversationProvider initialState={result}>
            <CurrentUsersProvider initialState={usersState}>
              <AuthProvider>
                <ActionHandler />
                <NextTopLoader />
                <ActiveStatus />
                {children}
              </AuthProvider>
              <Toaster />
            </CurrentUsersProvider>
          </CurrentConversationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
