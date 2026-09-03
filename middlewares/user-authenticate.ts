import { Context, Next } from 'hono'

import { db } from '@/lib/db'

interface UserAuthenticate {
  authId: string
}

declare module 'hono' {
  interface ContextVariableMap {
    userAuthenticate: UserAuthenticate
  }
}

export const userAuthenticate = () => {
  return async (c: Context, next: Next) => {
    try {
      const auth = c.get('authUser')

      const authId = auth.token?.sub

      if (!authId) throw new Error('Usuário não autenticado')

      const user = await db.user.findUnique({ where: { id: authId } })
      if (!user) throw new Error('Usuário não autorizado')

      c.set('userAuthenticate', { authId })

      await next()
    } catch (error) {
      return c.json(
        {
          error:
            error instanceof Error ? error.message : 'Erro de autenticação',
        },
        401,
      )
    }
  }
}
