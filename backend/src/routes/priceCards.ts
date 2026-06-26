import { Hono } from "hono";
import {drizzle} from 'drizzle-orm/d1'
import { eq } from "drizzle-orm";
import * as schema from '../db/schema'
import type { AppEnv } from '../types'

/**
 * 単価設定（クライアント×カテゴリごとのリターン設定）
 * @example A株式会社のコーディング作業 → 現金 3000円
*/

const priceCards = new Hono<AppEnv>()

priceCards.get('/', async (c) => {
	const db = drizzle(c.env.time_tracker_db, {schema})
	const userId = c.get('userId')

	const allPriceCards = await db.select().from(schema.priceCards).innerJoin(schema.clients, eq(schema.priceCards.clientId, schema.clients.id)).innerJoin(schema.taskCategories, eq(schema.priceCards.taskCategoryId, schema.taskCategories.id)).where(eq(schema.clients.userId, userId))
})