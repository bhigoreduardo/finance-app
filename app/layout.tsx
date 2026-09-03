import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'

import { auth } from '@/auth'

import { Toaster } from '@/components/ui/sonner'
import { QueryProvider } from '@/providers/query-provider'
import { ThemeProvider } from '@/providers/theme-provider'

import './globals.css'

const openSans = Open_Sans({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Finance App',
  description: 'Organize suas finanças com o Finance App',
}

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const session = await auth()

  return (
    <SessionProvider session={session}>
      <html lang="pt-BR" suppressHydrationWarning={true}>
        <body className={openSans.className} cz-shortcut-listen="true">
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster />
              {children}
            </ThemeProvider>
          </QueryProvider>
        </body>
      </html>
    </SessionProvider>
  )
}
