import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { eq, and } from 'drizzle-orm'
import * as schema from '../db/schema'
import type { AppEnv } from '../types'

/**
 * タスククライアント
 * @example A株式会社、自己投資、家族
*/

const clients = new Hono<AppEnv>()

/**
 * 一覧取得
*/
clients.get('/', async (c) => {
  const db = drizzle(c.env.time_tracker_db, { schema })
  const userId = c.get('userId')
  const allClients = await db.select().from(schema.clients)
    .where(and(eq(schema.clients.userId, userId), eq(schema.clients.isActive, true)))
  return c.json(allClients)
})

/**
 * 登録
*/
clients.post('/', async (c) => {
  const db = drizzle(c.env.time_tracker_db, { schema })
  const userId = c.get('userId')
  const body = await c.req.json()
  const newClient = await db.insert(schema.clients).values({
    name: body.name,
    isPrivate: body.isPrivate ?? false,
    userId,
  }).returning()
  return c.json(newClient[0], 201)
})

/**
 * 変更
*/
clients.patch('/:id', async (c) => {
  const db = drizzle(c.env.time_tracker_db, { schema })
  const userId = c.get('userId')
  const id = c.req.param('id')
  const body = await c.req.json()

  const updated = await db.update(schema.clients)
  .set({ name: body.name, updatedAt: new Date().toISOString() })
  .where(and(eq(schema.clients.id, id), eq(schema.clients.userId, userId)))
  .returning()

  if (updated.length === 0) {
    return c.json({ error: 'クライアントが見つかりません' }, 404)
  }
  return c.json(updated[0])
})

/**
 * 削除 (論理削除)
*/
clients.delete('/:id', async (c) => {
  const db = drizzle(c.env.time_tracker_db, { schema })
  const userId = c.get('userId')
  const id = c.req.param('id')

  const updated = await db.update(schema.clients)
    .set({ isActive: false, updatedAt: new Date().toISOString() })
    .where(and(eq(schema.clients.id, id), eq(schema.clients.userId, userId)))
    .returning()

  if (updated.length === 0) {
    return c.json({ error: '既にデータがありません' }, 404)
  }
  return c.json({ success: true })
})


export default clients