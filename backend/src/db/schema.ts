import { sqliteTable, text, integer, index, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { relations, sql } from 'drizzle-orm'

export const users = sqliteTable('User', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: text('createdAt').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updatedAt').notNull().default(sql`(datetime('now'))`),
})

export const clients = sqliteTable('Client', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  isPrivate: integer('isPrivate', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('createdAt').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updatedAt').notNull().default(sql`(datetime('now'))`),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
}, (table) => [
  index('Client_userId_idx').on(table.userId),
])

export const taskCategories = sqliteTable('TaskCategory', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  createdAt: text('createdAt').notNull().default(sql`(datetime('now'))`),
})

export const priceCards = sqliteTable('PriceCard', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  valueType: text('valueType').notNull(),
  amount: integer('amount').notNull(),
  stampIcon: text('stampIcon'),
  createdAt: text('createdAt').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updatedAt').notNull().default(sql`(datetime('now'))`),
  clientId: text('clientId').notNull().references(() => clients.id, { onDelete: 'cascade' }),
  taskCategoryId: text('taskCategoryId').notNull().references(() => taskCategories.id, { onDelete: 'cascade' }),
}, (table) => [
  uniqueIndex('PriceCard_clientId_taskCategoryId_key').on(table.clientId, table.taskCategoryId),
])

export const timeLogs = sqliteTable('TimeLog', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  description: text('description').notNull(),
  startTime: text('startTime').notNull().default(sql`(datetime('now'))`),
  endTime: text('endTime'),
  isInterrupt: integer('isInterrupt', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('createdAt').notNull().default(sql`(datetime('now'))`),
  clientId: text('clientId').notNull().references(() => clients.id, { onDelete: 'cascade' }),
  taskCategoryId: text('taskCategoryId').notNull().references(() => taskCategories.id, { onDelete: 'cascade' }),
}, (table) => [
  index('TimeLog_clientId_idx').on(table.clientId),
  index('TimeLog_startTime_endTime_idx').on(table.startTime, table.endTime),
])

export const rewardSettings = sqliteTable('RewardSetting', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  requiredLogs: integer('requiredLogs').notNull(),
  createdAt: text('createdAt').notNull().default(sql`(datetime('now'))`),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
}, (table) => [
  index('RewardSetting_userId_idx').on(table.userId),
])

export const usersRelations = relations(users, ({ many }) => ({
  clients: many(clients),
  rewardSettings: many(rewardSettings),
}))

export const clientsRelations = relations(clients, ({ one, many }) => ({
  user: one(users, { fields: [clients.userId], references: [users.id] }),
  priceCards: many(priceCards),
  timeLogs: many(timeLogs),
}))

export const taskCategoriesRelations = relations(taskCategories, ({ many }) => ({
  priceCards: many(priceCards),
  timeLogs: many(timeLogs),
}))

export const priceCardsRelations = relations(priceCards, ({ one }) => ({
  client: one(clients, { fields: [priceCards.clientId], references: [clients.id] }),
  taskCategory: one(taskCategories, { fields: [priceCards.taskCategoryId], references: [taskCategories.id] }),
}))

export const timeLogsRelations = relations(timeLogs, ({ one }) => ({
  client: one(clients, { fields: [timeLogs.clientId], references: [clients.id] }),
  taskCategory: one(taskCategories, { fields: [timeLogs.taskCategoryId], references: [taskCategories.id] }),
}))

export const rewardSettingsRelations = relations(rewardSettings, ({ one }) => ({
  user: one(users, { fields: [rewardSettings.userId], references: [users.id] }),
}))
