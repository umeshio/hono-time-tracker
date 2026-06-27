// import { Hono } from "hono";
// import {drizzle} from 'drizzle-orm/d1'
// import { eq } from "drizzle-orm";
// import * as schema from '../db/schema'
// import type { AppEnv } from '../types'

// /**
//  * 単価設定（クライアント×カテゴリごとのリターン設定）
//  * @example A株式会社のコーディング作業 → 現金 3000円
// */

// const priceCards = new Hono<AppEnv>()

// /**
//  * 登録価格を取得
// */
// priceCards.get('/', async (c) => {
// 	const db = drizzle(c.env.time_tracker_db, {schema})
// 	const userId = c.get('userId')

// 	const allPriceCards = await db.select().from(schema.priceCards).innerJoin(schema.clients, eq(schema.priceCards.clientId, schema.clients.id)).innerJoin(schema.taskCategories, eq(schema.priceCards.taskCategoryId, schema.taskCategories.id)).where(eq(schema.clients.userId, userId))
// })

// /**
//  * 価格カードを登録
// */
// priceCards.post('/', async (c) => {
// 	const db = drizzle(c.env.time_tracker_db, {schema})
// 	const body = await c.req.json()

// 	try {
// 		const newPriceCard = await db.insert(schema.priceCards).values({
//       clientId: body.clientId,
//       taskCategoryId: body.taskCategoryId,
//       valueType: body.valueType,
//       amount: body.amount,
//       stampIcon: body.stampIcon || null,
//     }).returning()
//     return c.json(newPriceCard[0], 201)
//   } catch (e) {
//     return c.json({ error: 'このクライアントとカテゴリの組み合わせはすでに設定されています' }, 400)
//   }
// })

// export default priceCards