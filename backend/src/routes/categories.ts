import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import * as schema from '../db/schema'
import type { AppEnv } from '../types'

/**
 * タスククカテゴリ
 * @example コーディング、 家事、料理
*/

const categories = new Hono<AppEnv>()

/**
 * タスク種類の一覧取得
*/
categories.get('/', async (c) => {
	const db = drizzle(c.env.time_tracker_db, {schema})
	const allCategories = await db.select().from(schema.taskCategories)
	return c.json(allCategories)
})

/**
 * タスク種類の作成
*/
categories.post('/', async (c) => {
	const db = drizzle(c.env.time_tracker_db, { schema })
	const body = await c.req.json()
	const newCategories = await db.insert(schema.taskCategories).values({
		name: body.name,
	}).returning()
	return c.json(newCategories[0], 201)
})

export default categories