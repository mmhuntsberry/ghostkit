import { InferSelectModel } from "drizzle-orm";
import { pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core";

/**
 * BRANDS
 *   id        : primary key
 *   name      : human‐readable brand name
 *   slug      : unique, lowercase identifier (e.g. "cosmopolitan")
 *   tokens    : one JSONB column holding the entire nested Figma→Style‐Dictionary payload
 *   createdAt : timestamp (defaults to now())
 *   updatedAt : timestamp (defaults to now(), updated by code)
 */
export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  tokens: jsonb("tokens").notNull().default(JSON.stringify({})),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Brand = InferSelectModel<typeof brands>;
