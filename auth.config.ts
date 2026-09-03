import bcrypt from 'bcryptjs'
import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'

import { db } from '@/lib/db'

import { signInSchema as signInUserSchema } from '@/features/user/authenticate/schema'

export default {
  providers: [
    Google({
      id: 'user-google-credentials',
      name: 'User Google Credentials',
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      id: 'user-credentials',
      name: 'User Credentials',
      async authorize(credentials) {
        const validatedFields = signInUserSchema.safeParse(credentials)

        if (!validatedFields.success) return null
        const { email, password } = validatedFields.data

        const existingUser = await db.user.findUnique({
          where: { email },
        })

        if (!existingUser || !existingUser.password) return null

        const passwordsMatch = await bcrypt.compare(
          password,
          existingUser.password,
        )
        if (passwordsMatch) return existingUser

        return null
      },
    }),
  ],
} satisfies NextAuthConfig
