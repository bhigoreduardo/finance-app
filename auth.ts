import NextAuth from 'next-auth'
import type { Adapter } from '@auth/core/adapters'
import { PrismaAdapter } from '@auth/prisma-adapter'

import { db } from '@/lib/db'

import authConfig from '@/auth.config'

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/entrar',
    error: '/entrar/error',
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      })
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'user-google-credentials') return true

      if (!user || !user.id || !user.email) return false

      const existingUser = await db.user.findUnique({ where: { id: user.id } })
      if (!existingUser) return false

      return true
    },
    async jwt({ token }) {
      if (!token.sub) return token

      const existingUser = await db.user.findUnique({
        where: { id: token.sub },
        omit: { password: true },
      })
      if (!existingUser) return token

      token.status = existingUser.status
      token.isOauth = existingUser.isOauth
      token.whatsApp = existingUser.whatsApp

      return token
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      session.user = { ...session.user, ...token } as typeof session.user

      return session
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  session: { strategy: 'jwt' },
  ...authConfig,
})
