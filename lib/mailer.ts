import nodemailer from 'nodemailer'

type SMTPEmailConfig = {
  host: string
  port: number
  secure: boolean
  user: string
  pass: string
}

const SMTPconfig: SMTPEmailConfig = {
  host: process.env.SMTP_EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_EMAIL_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  user: process.env.SMTP_EMAIL_USER || '',
  pass: process.env.SMTP_EMAIL_PASS || '',
}

export const transporter = nodemailer.createTransport({
  host: SMTPconfig.host,
  port: SMTPconfig.port,
  secure: SMTPconfig.secure,
  auth: {
    user: SMTPconfig.user,
    pass: SMTPconfig.pass,
  },
  tls: {
    rejectUnauthorized: false,
  },
})
