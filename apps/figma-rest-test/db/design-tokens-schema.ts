// apps/figma-rest-test/db/design-tokens-schema.ts
import { pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { InferSelectModel } from "drizzle-orm";

// —————————————————————————————————————
//  A “brands” table that holds each brand’s slug, name, and a JSONB `tokens` column.
//  Feel free to adjust column names/types to your needs.
// —————————————————————————————————————
export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(), // e.g. "acmebrand"
  name: text("name").notNull(), // e.g. "AcmeBrand"
  tokens: jsonb("tokens").notNull(), // We’ll upsert the entire token JSON here

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// (Optionally export other tables here, e.g. networkGroups/locales/etc., if you need them.)

// Typescript helper type if you ever need it:
export type Brand = InferSelectModel<typeof brands>;
