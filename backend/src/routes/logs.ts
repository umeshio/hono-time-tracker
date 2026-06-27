import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { eq, isNull, and, desc } from 'drizzle-orm'
import * as schema from '../db/schema'
import type { AppEnv } from '../types'


/**
 * タイマー
 * 開始時刻・停止時刻
*/

const logs = new Hono<AppEnv>()

/**
 * タイマー開始ログ作成
 * クライアントid,カテゴリid,説明文を挿入。
 * 時間とログIDは自動生成される
*/
logs.post('/start', async (c) => {
  try {
    const db = drizzle(c.env.time_tracker_db, {schema})
    const reqLog = await c.req.json()
    const newlog = await db.insert(schema.timeLogs).values({
      clientId: reqLog.clientId,
      taskCategoryId: reqLog.taskCategoryId,
      description: reqLog.description,
      valueType: reqLog.valueType,
      amount: reqLog.amount,
      stampIcon: reqLog.stampIcon || null,
    }).returning()
    return c.json(newlog[0], 201)
  } catch (e) {
    return c.json({ error: String(e) }, 500)
  }
})


/**
 * タイマー停止（終了時刻を記録）
*/
logs.patch('/:id/stop', async (c) => {
	const db = drizzle(c.env.time_tracker_db, {schema})
	const id = c.req.param('id')
	const now = new Date().toISOString()
	
	const updated = await db.update(schema.timeLogs)
		.set({ endTime: now }) 
		.where(eq(schema.timeLogs.id, id))
		.returning()
	return c.json(updated[0])
})

/**
 * ログ一覧取得
 * ログインユーザーの全履歴、新しい順
*/
logs.get('/', async (c) => {
  const db = drizzle(c.env.time_tracker_db, {schema})
  const userId = c.get('userId')
  
  const allLogs = await db.select().from(schema.timeLogs)
  .innerJoin(schema.clients, eq(schema.timeLogs.clientId, schema.clients.id))
  .innerJoin(schema.taskCategories, eq(schema.timeLogs.taskCategoryId, schema.taskCategories.id))
    .where(eq(schema.clients.userId, userId))
    .orderBy(desc(schema.timeLogs.startTime))

  return c.json(allLogs)
})

/**
 * 現在計測中のログ取得
*/
logs.get('/current', async (c) => {
	const db = drizzle(c.env.time_tracker_db, {schema})
	const userId = c.get('userId')

	const currentLog = await db.select().from(schema.timeLogs)
  .innerJoin(schema.clients, eq(schema.timeLogs.clientId, schema.clients.id))
  .where(
    and(
      isNull(schema.timeLogs.endTime),
      eq(schema.clients.userId, userId)
    )
  )
  .limit(1)

return c.json(currentLog[0] ?? null)
})

export default logs