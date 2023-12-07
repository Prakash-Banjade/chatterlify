import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/context/ThemeProvider'
import { Toaster } from "@/components/ui/toaster"
import AuthProvider from '@/context/AuthProvider'
import NextTopLoader from 'nextjs-toploader';
import ActiveStatus from './components/ActiveStatus'
import { ActionHandler } from './action-handler'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: `${process.env.APP_NAME} - your chat matters`,
  description: 'Chat with your connections',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ActionHandler />
            <NextTopLoader />
            <ActiveStatus />
            {children}
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
