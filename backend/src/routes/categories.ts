import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { eq } from 'drizzle-orm'
import * as schema from '../db/schema'
import type { AppEnv } from '../types'

/**
 * タスククカテゴリ
 * @example コーディング、 家事、料理
*/

const categories = new Hono<AppEnv>()

/**
 * 一覧取得
*/
categories.get('/', async (c) => {
  const db = drizzle(c.env.time_tracker_db, { schema })
  const allCategories = await db.select().from(schema.taskCategories)
    .where(eq(schema.taskCategories.isActive, true))
  return c.json(allCategories)
})

/**
 * 作成
*/
categories.post('/', async (c) => {
	const db = drizzle(c.env.time_tracker_db, { schema })
	const body = await c.req.json()
	const newCategories = await db.insert(schema.taskCategories).values({
		name: body.name,
	}).returning()
	return c.json(newCategories[0], 201)
})

/**
 * 変更
*/
categories.patch('/:id', async (c) => {
  const db = drizzle(c.env.time_tracker_db, { schema })
  const id = c.req.param('id')
  const body = await c.req.json()

  const updated = await db.update(schema.taskCategories)
    .set({ name: body.name })
    .where(eq(schema.taskCategories.id, id))
    .returning()

  if (updated.length === 0) {
    return c.json({ error: 'カテゴリが見つかりません' }, 404)
  }
  return c.json(updated[0])
})

/**
 * 削除
*/
categories.delete('/:id', async (c) => {
  const db = drizzle(c.env.time_tracker_db, { schema })
  const id = c.req.param('id')

  const updated = await db.update(schema.taskCategories)
    .set({ isActive: false })
    .where(eq(schema.taskCategories.id, id))
    .returning()

  if (updated.length === 0) {
    return c.json({ error: '既にデータがありません' }, 404)
  }
  return c.json({ success: true })
})

export default categories