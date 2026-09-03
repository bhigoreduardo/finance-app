import z from 'zod'
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'

const app = new Hono().post(
  '/verify-recaptcha',
  zValidator(
    'json',
    z.object({
      recaptchaToken: z.string().nullish(),
    }),
  ),
  async (c) => {
    const { recaptchaToken } = c.req.valid('json')

    if (!recaptchaToken)
      return c.json({ error: 'Por favor, complete o reCAPTCHA' }, 400)

    const verifyCaptcha = async (token: string) => {
      const secretKey = process.env.RECAPTCHA_PRIVATE_KEY
      const url = process.env.RECAPTCHA_ENDPOINT

      if (!secretKey || !url) {
        throw new Error('reCAPTCHA inválido')
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          secret: secretKey,
          response: token,
        }).toString(),
      })

      if (!response.ok) {
        throw new Error(`Erro ao verificar o reCAPTCHA: ${response.statusText}`)
      }

      const data = await response.json()
      return data.success
    }

    try {
      const isValid = await verifyCaptcha(recaptchaToken)

      if (!isValid) {
        return c.json(
          { error: 'Falha na validação do reCAPTCHA, confirme novamente' },
          400,
        )
      }

      return c.json({ success: 'reCAPTCHA validado com sucesso' }, 200)
    } catch (error) {
      console.log(error)
      return c.json({ error: 'Erro interno na verificação do reCAPTCHA' }, 500)
    }
  },
)

export default app
