import { sqliteTable, text, integer, index, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { relations, sql } from 'drizzle-orm'

/**
 * Table
 * ユーザー
*/
export const users = sqliteTable('User', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: text('createdAt').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updatedAt').notNull().default(sql`(datetime('now'))`),
})

/**
 * Table
 * クライアント（企業・投資相手）
*/
export const clients = sqliteTable('Client', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  isPrivate: integer('isPrivate', { mode: 'boolean' }).notNull().default(false),
  isActive: integer('isActive', { mode: 'boolean' }).notNull().default(true), // 追加
  createdAt: text('createdAt').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updatedAt').notNull().default(sql`(datetime('now'))`),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
}, (table) => [
  index('Client_userId_idx').on(table.userId),
])

/**
 * Table
 * タスクカテゴリ
*/
export const taskCategories = sqliteTable('TaskCategory', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  isActive: integer('isActive', { mode: 'boolean' }).notNull().default(true), // 追加
  createdAt: text('createdAt').notNull().default(sql`(datetime('now'))`),
})


/**
 * Table
 * タイムログ
*/
export const timeLogs = sqliteTable('TimeLog', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  description: text('description').notNull(),
  startTime: text('startTime').notNull().default(sql`(datetime('now'))`),
  endTime: text('endTime'),
  isInterrupt: integer('isInterrupt', { mode: 'boolean' }).notNull().default(false),
  valueType: text('valueType').notNull(),
  amount: integer('amount').notNull(),
  stampIcon: text('stampIcon'),
  createdAt: text('createdAt').notNull().default(sql`(datetime('now'))`),
  clientId: text('clientId').notNull().references(() => clients.id, { onDelete: 'restrict' }),
  taskCategoryId: text('taskCategoryId').notNull().references(() => taskCategories.id, { onDelete: 'restrict' }),
}, (table) => [
  index('TimeLog_clientId_idx').on(table.clientId),
  index('TimeLog_startTime_endTime_idx').on(table.startTime, table.endTime),
])

/**
 * Table
 * リワード
*/
export const rewardSettings = sqliteTable('RewardSetting', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  requiredLogs: integer('requiredLogs').notNull(),
  createdAt: text('createdAt').notNull().default(sql`(datetime('now'))`),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
}, (table) => [
  index('RewardSetting_userId_idx').on(table.userId),
])


/**
 * リレーション
*/
export const usersRelations = relations(users, ({ many }) => ({
  clients: many(clients),
  rewardSettings: many(rewardSettings),
}))

export const clientsRelations = relations(clients, ({ one, many }) => ({
  user: one(users, { fields: [clients.userId], references: [users.id] }),
  timeLogs: many(timeLogs),
}))

export const taskCategoriesRelations = relations(taskCategories, ({ many }) => ({
  timeLogs: many(timeLogs),
}))

export const timeLogsRelations = relations(timeLogs, ({ one }) => ({
  client: one(clients, { fields: [timeLogs.clientId], references: [clients.id] }),
  taskCategory: one(taskCategories, { fields: [timeLogs.taskCategoryId], references: [taskCategories.id] }),
}))

export const rewardSettingsRelations = relations(rewardSettings, ({ one }) => ({
  user: one(users, { fields: [rewardSettings.userId], references: [users.id] }),
}))