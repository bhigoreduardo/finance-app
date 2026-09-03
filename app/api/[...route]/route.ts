import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { initAuthConfig, type AuthConfig } from '@hono/auth-js'

import authConfig from '@/auth.config'

import commmons from './common'

import authenticate from './authenticate'

import category from './category'

const app = new Hono().basePath('/api')

app.use('*', initAuthConfig(getAuthConfig))

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .route('/commmons', commmons)

  .route('/authenticate', authenticate)

  .route('/categories', category)

// @ts-ignor
function getAuthConfig(): AuthConfig {
  return { ...authConfig }
}
export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes
