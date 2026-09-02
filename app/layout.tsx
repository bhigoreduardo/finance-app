import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'

import './globals.css'

const openSans = Open_Sans({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Finance App',
  description: 'Organize suas finanças com o Finance App',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning={true}>
      <body className={openSans.className} cz-shortcut-listen="true">
        {children}
      </body>
    </html>
  )
}
