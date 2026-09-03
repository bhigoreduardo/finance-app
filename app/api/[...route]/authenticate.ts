import z from 'zod'
import _ from 'lodash.omit'
import { Hono } from 'hono'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { AuthError } from 'next-auth'
import { verifyAuth } from '@hono/auth-js'
import { createId } from '@paralleldrive/cuid2'
import { zValidator } from '@hono/zod-validator'

import { signIn } from '@/auth'

import {
  sendForgotPasswordToken,
  sendTwoFactorTokenEmail,
  sendSignUpVerificationToken,
} from '@/lib/mails'
import {
  generateTwoFactorToken,
  getTwoFactorTokenByEmail,
  generateVerificationToken,
  getTwoFactorConfirmationByUserId,
} from '@/lib/helpers'
import { db } from '@/lib/db'
import { transporter } from '@/lib/mailer'

import { userAuthenticate } from '@/middlewares/user-authenticate'

import {
  insertUserCompleteSchema,
  insertUserSchema,
} from '@/features/user/schema'
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
} from '@/features/user/authenticate/schema'
import { updatePasswordSchema } from '@/features/common/schema'

const app = new Hono()
  .post('/sign-up', zValidator('json', insertUserSchema), async (c) => {
    const validatedFields = c.req.valid('json')
    if (!validatedFields) return c.json({ error: 'Campos inválidos' }, 400)

    const { email, password, repeatPassword, hasAcceptedTerms, ...values } =
      validatedFields

    if (!hasAcceptedTerms)
      return c.json({ error: 'Termos são obrigatórios' }, 400)
    if (!password || password !== repeatPassword)
      return c.json(
        { error: 'Senhas são obrigatórios e devem ser iguais' },
        400,
      )

    const existingUser = await db.user.findUnique({ where: { email } })
    if (existingUser) return c.json({ error: 'Usuário já cadastrado' }, 400)

    const hashedPassword = await bcrypt.hash(password, 10)
    await db.user.create({
      data: {
        id: createId(),
        ...values,
        email,
        password: hashedPassword,
        hasAcceptedTerms,
        isOauth: false,
      },
    })

    const verificationToken = await generateVerificationToken(email)
    const mailOptions = sendSignUpVerificationToken(
      verificationToken.email,
      verificationToken.token,
    )

    try {
      await transporter.sendMail(mailOptions)
      return c.json(
        { success: 'Acesse seu email e confirme seu cadastro!' },
        201,
      )
    } catch (error) {
      return c.json(
        { error: 'Falha no envio do email, entre em contato com suporte' },
        500,
      )
    }
  })
  .post(
    '/sign-up/verified',
    zValidator('query', z.object({ token: z.string().optional() })),
    async (c) => {
      const { token } = c.req.valid('query')

      if (!token) return c.json({ error: 'Usuário inválido' }, 400)

      const existingUserToken = await db.verificationToken.findUnique({
        where: { token },
      })
      if (!existingUserToken)
        return c.json({ error: 'Usuário não cadastrado' }, 404)

      const hasExpired = new Date(existingUserToken.expires) < new Date()
      if (hasExpired) {
        return c.json({ error: 'Token expirado, faça novamente o login' }, 400)
      }

      const existingUser = await db.user.findUnique({
        where: { email: existingUserToken.email },
      })
      if (!existingUser) {
        return c.json({ error: 'Usuário não cadastrado' }, 404)
      }

      await db.user.update({
        where: { email: existingUser.email, id: existingUser.id },
        data: { emailVerified: new Date() },
      })

      await db.verificationToken.delete({
        where: { id: existingUserToken.id, token: existingUserToken.token },
      })

      return c.json({ success: 'Conta verificada, acesse sua conta' }, 200)
    },
  )
  .post(
    '/sign-up/complete',
    verifyAuth(),
    userAuthenticate(),
    zValidator('json', insertUserCompleteSchema),
    async (c) => {
      const { authId } = c.get('userAuthenticate')

      const validatedFields = c.req.valid('json')
      if (!validatedFields) return c.json({ error: 'Campos inválidos' }, 400)

      await db.user.update({
        where: { id: authId },
        data: { ...validatedFields },
      })

      return c.json({ success: 'Cadastro completo' }, 200)
    },
  )
  .post('/sign-in', zValidator('json', signInSchema), async (c) => {
    const validatedFields = c.req.valid('json')
    if (!validatedFields) return c.json({ error: 'Campos inválidos' }, 400)

    const { email, password, code } = validatedFields
    const existingUser = await db.user.findUnique({ where: { email } })
    if (!existingUser || !existingUser.password) {
      return c.json({ error: 'Email não cadastrado' }, 404)
    }
    if (!existingUser.status) {
      return c.json({ error: 'Acesso não permitido' }, 403)
    }
    if (!code) {
      const passwordsMatch = await bcrypt.compare(
        password,
        existingUser.password,
      )
      if (!passwordsMatch) {
        return c.json({ error: 'Email e/ou senha inválidos' }, 400)
      }
    }

    if (!existingUser.emailVerified) {
      const verificationToken = await generateVerificationToken(
        existingUser.email,
      )

      const mailOptions = sendSignUpVerificationToken(
        verificationToken.email,
        verificationToken.token,
      )

      try {
        await transporter.sendMail(mailOptions)
        return c.json(
          { success: 'Acesse seu email e confirme seu cadastro!' },
          201,
        )
      } catch (error) {
        return c.json(
          { error: 'Falha no envio do email, entre em contato com suporte' },
          500,
        )
      }
    }

    if (existingUser.isTwoFactorEnabled && existingUser.email) {
      if (code) {
        const twoFactorToken = await getTwoFactorTokenByEmail(
          existingUser.email,
        )
        if (!twoFactorToken) {
          return c.json({ error: 'Código inválido' }, 400)
        }

        if (twoFactorToken.token !== code) {
          return c.json({ error: 'Código inválido' }, 400)
        }

        const hasExpired = new Date(twoFactorToken.expires) < new Date()
        if (hasExpired) {
          return c.json({ error: 'Código expirado' }, 400)
        }

        await db.twoFactorToken.delete({
          where: { id: twoFactorToken.id },
        })

        const existingConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id,
        )
        if (existingConfirmation) {
          await db.twoFactorConfirmation.delete({
            where: { id: existingConfirmation.id },
          })
        }

        await db.twoFactorConfirmation.create({
          data: { userId: existingUser.id },
        })
      } else {
        const twoFactorToken = await generateTwoFactorToken(existingUser.email)
        const mailOptions = sendTwoFactorTokenEmail(
          twoFactorToken.email,
          twoFactorToken.token,
        )

        try {
          await transporter.sendMail(mailOptions)
          return c.json(
            {
              success: 'Informe o código enviado ao seu email',
              twoFactor: true,
            },
            200,
          )
        } catch (error) {
          return c.json(
            { error: 'Falha no envio do email, entre em contato com suporte' },
            500,
          )
        }
      }
    }

    try {
      const endpoint = '/'

      await signIn('user-credentials', { email, password, redirect: false })

      return c.json(
        {
          success: 'Login realizado com sucesso',
          redirect: endpoint,
          update: true,
        },
        200,
      )
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return c.json({ error: 'Email e/ou senha inválidos' }, 400)
          default:
            return c.json(
              { error: 'Erro inesperado, contate o administrador' },
              500,
            )
        }
      }

      throw error
    }
  })
  .post('/sign-in/validate', verifyAuth(), async (c) => {
    const auth = c.get('authUser')

    if (!auth.token?.sub) {
      return c.json({ error: 'Usuário não autorizado' }, 401)
    }

    const existingUser = await db.user.findUnique({
      where: { id: auth.token.sub, status: true },
    })
    if (!existingUser) return c.json({ error: 'Usuário não autorizado' }, 401)

    return c.json({ success: !!existingUser })
  })

  .post(
    '/forgot-password',
    zValidator('json', forgotPasswordSchema),
    async (c) => {
      const validatedFields = c.req.valid('json')

      if (!validatedFields) return c.json({ error: 'Campos inválidos' }, 400)
      const { email } = validatedFields

      const existingUser = await db.user.findUnique({ where: { email } })
      if (!existingUser) return c.json({ error: 'Usuário não cadastrado' }, 404)

      const token = uuidv4()
      const expires = new Date(new Date().getTime() + 3600 * 1000)
      const existingToken = await db.passwordResetToken.findFirst({
        where: { email },
      })

      if (existingToken) {
        await db.passwordResetToken.delete({
          where: { id: existingToken.id },
        })
      }

      const passwordResetToken = await db.passwordResetToken.create({
        data: {
          email,
          token,
          expires,
        },
      })
      const mailOptions = sendForgotPasswordToken(
        passwordResetToken.email,
        passwordResetToken.token,
        '',
      )

      try {
        await transporter.sendMail(mailOptions)
        return c.json(
          { success: 'Acesse seu email para redefinir sua senha' },
          200,
        )
      } catch (error) {
        return c.json(
          { error: 'Falha no envio do email, entre em contato com suporte' },
          500,
        )
      }
    },
  )
  .post(
    '/reset-password',
    zValidator('json', resetPasswordSchema),
    zValidator(
      'query',
      z.object({
        token: z.string().optional(),
      }),
    ),
    async (c) => {
      const { token } = c.req.valid('query')
      const validatedFields = c.req.valid('json')

      if (!token) return c.json({ error: 'Token inválido' }, 400)
      if (!validatedFields) return c.json({ error: 'Campos inválidos' }, 400)
      const { password, repeatPassword } = validatedFields

      if (password !== repeatPassword)
        return c.json({ error: 'Senhas devem ser iguais' }, 400)

      const existingToken = await db.passwordResetToken.findUnique({
        where: { token },
      })
      if (!existingToken) {
        return c.json({ error: 'Token inválido' }, 400)
      }

      const hasExpired = new Date(existingToken.expires) < new Date()
      if (hasExpired) {
        return c.json({ error: 'Token expirado' }, 400)
      }

      const existingUser = await db.user.findUnique({
        where: { email: existingToken.email },
      })
      if (!existingUser) {
        return c.json({ error: 'Usuário não cadastrado' }, 404)
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      await db.user.update({
        where: { id: existingUser.id },
        data: { password: hashedPassword },
      })

      await db.passwordResetToken.delete({
        where: { id: existingToken.id },
      })

      try {
        const endpoint = '/'

        await signIn('user-credentials', {
          email: existingUser.email,
          password,
          redirect: false,
        })

        return c.json(
          {
            success: 'Senha redefinida com sucesso',
            redirect: endpoint,
            update: true,
          },
          200,
        )
      } catch (error) {
        if (error instanceof AuthError) {
          switch (error.type) {
            case 'CredentialsSignin':
              return c.json({ error: 'Credenciais inválidas' }, 400)
            default:
              return c.json({ error: 'Erro inesperado' }, 500)
          }
        }
        throw error
      }

      // return c.json({ success: 'Senha redefinida com sucesso' }, 200)
    },
  )

  .patch(
    '/update-password',
    verifyAuth(),
    userAuthenticate(),
    zValidator('json', updatePasswordSchema),
    async (c) => {
      const { authId } = c.get('userAuthenticate')

      const validatedFields = c.req.valid('json')
      if (!validatedFields) return c.json({ error: 'Campos inválidos' }, 400)

      const { password, newPassword, repeatPassword } = validatedFields

      if (newPassword !== repeatPassword)
        return c.json({ error: 'Senhas devem ser iguais' }, 400)

      const existingUser = await db.user.findUnique({
        where: { id: authId },
      })
      if (!existingUser || !existingUser.password)
        return c.json({ error: 'Usuário não autorizado' }, 401)

      const isConfirm = bcrypt.compareSync(password, existingUser.password)
      if (!isConfirm) return c.json({ error: 'Credenciais incorretas' }, 403)

      const hashedPassword = await bcrypt.hash(newPassword, 10)
      await db.user.update({
        where: { id: existingUser.id },
        data: { password: hashedPassword },
      })

      return c.json({ success: 'Senha alterada' }, 200)
    },
  )
  .patch('/update-2fa', verifyAuth(), userAuthenticate(), async (c) => {
    const { authId } = c.get('userAuthenticate')

    const existingUser = await db.user.findUnique({
      where: { id: authId },
    })
    if (!existingUser) return c.json({ error: 'Usuário não autorizado' }, 401)

    await db.user.update({
      where: { id: existingUser.id },
      data: { isTwoFactorEnabled: !existingUser.isTwoFactorEnabled },
    })

    return c.json({ success: 'Autenticação de dois fatores atualizada' }, 200)
  })
  .patch(
    '/',
    verifyAuth(),
    userAuthenticate(),
    zValidator('json', insertUserSchema),
    async (c) => {
      const { authId } = c.get('userAuthenticate')

      const validatedFields = c.req.valid('json')
      if (!validatedFields) return c.json({ error: 'Campos inválidos' }, 400)

      const { email, ...values } = validatedFields

      const currentUser = await db.user.findUnique({ where: { id: authId } })
      if (!currentUser) return c.json({ error: 'Usuário não autorizado' }, 401)
      const existingUser = await db.user.findFirst({
        where: { email, NOT: { id: authId } },
      })
      if (existingUser) return c.json({ error: 'Email já cadastrado' }, 400)

      const cleanedValues = _(values, [
        'password',
        'repeatPassword',
        'hasAcceptedTerms',
      ])

      await db.user.update({
        where: { id: authId },
        data: {
          ...cleanedValues,
          email,
        },
      })

      return c.json({ success: 'Dados pessoais atualizados' }, 200)
    },
  )
  .get('/current', verifyAuth(), userAuthenticate(), async (c) => {
    const { authId } = c.get('userAuthenticate')

    const data = await db.user.findUnique({
      where: { id: authId },
      omit: { password: true },
    })
    if (!data) return c.json({ error: 'Usuário não autorizado' }, 401)

    return c.json({ data }, 200)
  })

export default app
