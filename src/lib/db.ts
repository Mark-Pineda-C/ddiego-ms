import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";

import { sql } from "@vercel/postgres";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/vercel-postgres";

export const db = drizzle(sql);

export const users = pgTable("dd_user", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  image: text("image"),
  hashedPassword: text("hashed_password").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const sessions = pgTable("dd_session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

// regular types
export type UserI = typeof users.$inferSelect;
export type SessionI = typeof sessions.$inferSelect;

// types for insert
export type UserCreate = typeof users.$inferInsert;
export type SessionCreate = typeof sessions.$inferInsert;
