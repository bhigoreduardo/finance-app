import { z } from 'zod'
import { Hono } from 'hono'
import { verifyAuth } from '@hono/auth-js'
import { createId } from '@paralleldrive/cuid2'
import { zValidator } from '@hono/zod-validator'

import { db } from '@/lib/db'

import { insertCategorySchema } from '@/features/category/schema'
import { userAuthenticate } from '@/middlewares/user-authenticate'

const app = new Hono()
  .post(
    '/',
    verifyAuth(),
    userAuthenticate(),
    zValidator('json', insertCategorySchema),
    async (c) => {
      const { authId } = c.get('userAuthenticate')

      const validatedFields = c.req.valid('json')
      if (!validatedFields) return c.json({ error: 'Campos inválidos' }, 400)

      await db.category.create({
        data: {
          ...validatedFields,
          id: createId(),
          userId: authId,
        },
      })

      return c.json({ success: 'Categoria criada' }, 201)
    },
  )
  .post(
    '/bulk-delete',
    verifyAuth(),
    userAuthenticate(),
    zValidator('json', z.object({ ids: z.array(z.string()) })),
    async (c) => {
      const { authId } = c.get('userAuthenticate')

      const { ids } = c.req.valid('json')

      const data = await db.category.deleteMany({
        where: {
          id: { in: ids },
          userId: authId,
        },
      })

      if (!data) {
        return c.json({ error: 'Falha na exclusão das categorias' }, 400)
      }

      return c.json({ success: 'Categorias excluídas' }, 200)
    },
  )
  .patch(
    '/:id',
    verifyAuth(),
    userAuthenticate(),
    zValidator('param', z.object({ id: z.string().optional() })),
    zValidator('json', insertCategorySchema),
    async (c) => {
      const { authId } = c.get('userAuthenticate')

      const { id } = c.req.valid('param')
      const validatedFields = c.req.valid('json')
      if (!id) return c.json({ error: 'Identificador não encontrado' }, 400)
      if (!validatedFields) return c.json({ error: 'Campos inválidos' }, 400)

      await db.category.update({
        where: { id, userId: authId },
        data: { ...validatedFields },
      })

      return c.json({ success: 'Categoria atualizada' }, 200)
    },
  )
  .get('/', verifyAuth(), userAuthenticate(), async (c) => {
    const { authId } = c.get('userAuthenticate')

    const data = await db.category.findMany({
      where: { userId: authId },
      orderBy: { name: 'asc' },
    })

    return c.json({ data }, 200)
  })
  .get(
    '/:id',
    verifyAuth(),
    userAuthenticate(),
    zValidator('param', z.object({ id: z.string().optional() })),
    async (c) => {
      const { authId } = c.get('userAuthenticate')

      const { id } = c.req.valid('param')
      if (!id) return c.json({ error: 'Identificador não encontrado' }, 400)

      const data = await db.category.findUnique({
        where: { id, userId: authId },
      })

      if (!data) {
        return c.json({ error: 'Categoria não cadastrada' }, 404)
      }

      return c.json({ data }, 200)
    },
  )
  .delete(
    '/:id',
    verifyAuth(),
    userAuthenticate(),
    zValidator('param', z.object({ id: z.string().optional() })),
    async (c) => {
      const { authId } = c.get('userAuthenticate')

      const { id } = c.req.valid('param')
      if (!id) return c.json({ error: 'Identificador não encontrado' }, 400)

      const data = await db.category.deleteMany({
        where: { id, userId: authId },
      })

      if (!data) {
        return c.json({ error: 'Falha na exclusão da categoria' }, 400)
      }

      return c.json({ success: 'Categoria excluída' }, 200)
    },
  )

export default app
