import { Hono } from 'hono'
import { sign } from 'hono/jwt'
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'
import bcrypt from 'bcryptjs'
import * as schema from '../db/schema'

type Bindings = CloudflareBindings

const auth = new Hono<{ Bindings: Bindings }>()

// (メール・パスワード)

/**
 * サインアップ
 * --------------------------------
*/
auth.post('/signup', async (c) => {
  const db = drizzle(c.env.time_tracker_db, { schema })
  const { email, password } = await c.req.json()

	//メールの重複チェック
  const existing = await db.select().from(schema.users).where(eq(schema.users.email, email))
  if (existing.length > 0) {
    return c.json({ error: 'このメールアドレスはすでに使われています' }, 400)
  }

	// パスワードのハッシュ化
	const hashedPassword = await bcrypt.hash(password, 10)

	//新しくユーザーを登録
  const newUser = await db.insert(schema.users).values({
    email,
    password: hashedPassword,
  }).returning()

  return c.json({ id: newUser[0].id, email: newUser[0].email }, 201)
})


/**
 * ログイン
 * --------------------------------
*/
auth.post('/login', async (c) => {
  const db = drizzle(c.env.time_tracker_db, { schema })
  const { email, password } = await c.req.json()

	//メールアドレスが合致するユーザーを抽出
  const result = await db.select().from(schema.users).where(eq(schema.users.email, email))
  if (result.length === 0) {
    return c.json({ error: 'メールアドレスまたはパスワードが正しくありません' }, 401)
  }

	// 抽出されたユーザーのパスワードが合致するか
  const user = result[0]
  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    return c.json({ error: 'メールアドレスまたはパスワードが正しくありません' }, 401)
  }

  const token = await sign(
    { userId: user.id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 },
    c.env.JWT_SECRET
  )

  return c.json({ token })
})

export default auth