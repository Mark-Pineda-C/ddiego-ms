import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";

import { sql } from "@vercel/postgres";
import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/vercel-postgres";

export const db = drizzle(sql);

export const userTable = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    username: text("username").notNull().unique(),
    name: text("name").notNull(),
    image: text("image"),
    hashedPassword: text("hashed_password").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (user) => {
    return { uniqueIdx: uniqueIndex("unique_idx").on(user.username) };
  }
);

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const adapter = new DrizzlePostgreSQLAdapter(
  db,
  sessionTable,
  userTable
);

// regular types
export type UserI = typeof userTable.$inferSelect;
export type SessionI = typeof sessionTable.$inferSelect;

// types for insert
export type UserCreate = typeof userTable.$inferInsert;
export type SessionCreate = typeof sessionTable.$inferInsert;
