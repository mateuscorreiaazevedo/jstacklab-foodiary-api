import { date, integer, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const accountsTable = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  email: varchar({length: 255}).notNull().unique(),
  password: varchar({length: 255}).notNull(),
  name: varchar({length: 255}).notNull(),
  goal: varchar({length: 8}).notNull(),
  gender: varchar({length: 6}).notNull(),
  birthDate: date('birth_date').notNull(),
  height: integer().notNull(),
  weight: integer().notNull(),
  activityLevel: integer('activity_level').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),

  // Goals
  calories: integer().notNull(),
  proteins: integer().notNull(),
  carbs: integer().notNull(),
  fats: integer().notNull(),
})
