import { type DefaultSession } from 'next-auth'

import { UserRole } from '@prisma/client'

export type ExtendedUser = DefaultSession['user'] & {
  status: boolean
  isOauth: boolean

  whatsApp: string | null
}

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser
  }
}

import { JWT } from '@auth/core/jwt'

declare module '@auth/core/jwt' {
  interface JWT {
    status: boolean
    isOauth: boolean

    whatsApp: string | null
  }
}
