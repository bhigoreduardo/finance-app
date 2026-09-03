import nodemailer from 'nodemailer'

export const sendSignUpVerificationToken = (email: string, token: string) => {
  const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/verificar-email?token=${token}`

  const mailOptions: nodemailer.SendMailOptions = {
    from: 'contato@finance-app',
    to: email,
    subject: 'Confirme seu endereço de email',
    html: `<p>Acesse <a href="${confirmLink}">aqui</a> para confirmar seu cadastro.</p>`,
  }

  return mailOptions
}

export const sendTwoFactorTokenEmail = (email: string, token: string) => {
  const mailOptions: nodemailer.SendMailOptions = {
    from: 'contato@finance-app',
    to: email,
    subject: 'Código 2FA',
    html: `<p>Seu código 2FA: ${token}</p>`,
  }

  return mailOptions
}

export const sendForgotPasswordToken = (
  email: string,
  token: string,
  url: string,
) => {
  const resetPasswordLink = `${process.env.NEXT_PUBLIC_APP_URL}/redefinir-senha?token=${token}`

  const mailOptions: nodemailer.SendMailOptions = {
    from: 'contato@finance-app',
    to: email,
    subject: 'Redefinir senha',
    html: `<p>Acesse <a href="${resetPasswordLink}">aqui</a> para redefinir sua senha.</p>`,
  }

  return mailOptions
}
