import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { eq } from 'drizzle-orm'
import * as schema from '../db/schema'
import type { AppEnv } from '../types'

/**
 * タスククライアント
 * @example A株式会社、自己投資、家族
*/

const clients = new Hono<AppEnv>()

clients.get('/', async (c) => {
  const db = drizzle(c.env.time_tracker_db, { schema })
  const userId = c.get('userId')
  const allClients = await db.select().from(schema.clients)
    .where(eq(schema.clients.userId, userId))
  return c.json(allClients)
})

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

export default clients