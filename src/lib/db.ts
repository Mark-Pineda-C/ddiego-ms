import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";

import { sql } from "@vercel/postgres";
import {
  pgTable,
  text,
  timestamp,
  integer,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/vercel-postgres";

export const userRole = pgEnum("dd_user_role", [
  "seller",
  "admin",
  "superadmin",
  "distributor",
]);

export interface BillingData {
  bill: {
    count: number;
    serial: string;
  };
  ticket: {
    count: number;
    serial: string;
  };
}
export interface SellData {
  [key: string]: {
    price: number;
    stock: number;
  };
}

export const db = drizzle(sql);

export const offices = pgTable("dd_office", {
  id: text("id").primaryKey(),
  bearerToken: text("bearer_token"),
  urlToken: text("url_token"),
  billingData: jsonb("billing_data")
    .$type<BillingData>()
    .default({
      bill: { count: 0, serial: "" },
      ticket: { count: 0, serial: "" },
    }),
  name: text("name").notNull(),
  address: text("address"),
  cashbox: integer("cashbox").default(0),
  lastCashboxUpdate: timestamp("last_cashbox_update").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const products = pgTable("dd_product", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  sellData: jsonb("sell_data")
    .$type<SellData>()
    .default({
      default: {
        price: 0,
        stock: 0,
      },
    })
    .notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const users = pgTable("dd_user", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  image: text("image"),
  hashedPassword: text("hashed_password").notNull(),
  email: text("email"),
  role: userRole("role").notNull().default("seller"),
  officeId: text("office_id").references(() => offices.id),
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
