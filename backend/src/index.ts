import { Hono } from 'hono'
import { verify } from 'hono/jwt'
import { createMiddleware } from 'hono/factory'
import clients from './routes/clients'
import auth from './routes/auth'
import categories from './routes/categories'
import logs from './routes/logs'
import type { AppEnv } from './types'

const app = new Hono<AppEnv>()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// ミドルウェア
app.use('/api/*', createMiddleware<AppEnv>(async (c, next) => {
  // エンドポイントがauthなら続行(JWT認証へ)
  if (c.req.path.startsWith('/api/auth')) {
    return next()
  }
  // エンドポイントがauth以外なら常に認証保護
  const authorization = c.req.header('Authorization')
  if (!authorization?.startsWith('Bearer ')) {
    return c.json({ error: '認証が必要です' }, 401)
  }
  const token = authorization.slice(7)
  try {
    const payload = await verify(token, c.env.JWT_SECRET as string, 'HS256') as { userId: string }

    c.set('userId', payload.userId)
  } catch {
    return c.json({ error: 'トークンが無効です' }, 401)
  }
  await next()
}))

app.route('/api/auth', auth)
app.route('/api/clients', clients)
app.route('/api/categories', categories)
app.route('/api/logs', logs)

export default app