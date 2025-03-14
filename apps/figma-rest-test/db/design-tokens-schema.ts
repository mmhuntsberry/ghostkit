import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";

/**
 * Network Groups Table
 * Stores different network groups (e.g., "Fashion & Luxury Collection")
 */
export const networkGroups = pgTable("network_groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Brands Table
 * Stores basic info about each brand, linked to a network group
 */
export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  networkGroupId: integer("network_group_id")
    .references(() => networkGroups.id, { onDelete: "cascade" })
    .$type<number | null>() // Allows `null` values in TypeScript
    .default(null),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Locales Table
 * Stores locale information related to brands
 */
export const locales = pgTable("locales", {
  id: serial("id").primaryKey(),
  brandId: integer("brand_id")
    .references(() => brands.id, { onDelete: "cascade" })
    .notNull(),
  locale: text("locale").notNull(),
  country: text("country").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
/**
 * Countries Table
 * Stores country information related to brands
 */
export const countries = pgTable("countries", {
  id: serial("id").primaryKey(),
  brandId: integer("brand_id")
    .references(() => brands.id, { onDelete: "cascade" })
    .notNull(),
  country: text("country").notNull(), // e.g., "Spain", "Japan"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Brand Colors
 * Stores multiple colors for each brand
 */
export const brandColors = pgTable("brand_colors", {
  id: serial("id").primaryKey(),
  brandId: integer("brand_id")
    .references(() => brands.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(), // e.g., "palette/brand/1"
  hex: text("hex").notNull(), // e.g., "#1C1C9B"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Brand Typography
 * Stores typography tokens following "font/family/primary" format
 */
export const brandTypography = pgTable("brand_typography", {
  id: serial("id").primaryKey(),
  brandId: integer("brand_id")
    .references(() => brands.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(), // e.g., "font/family/primary"
  value: text("value").notNull(), // e.g., "Arial"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Relations
 */
export const networkGroupsRelations = relations(networkGroups, ({ many }) => ({
  brands: many(brands),
}));

export const brandsRelations = relations(brands, ({ many, one }) => ({
  colors: many(brandColors),
  typography: many(brandTypography),
  locales: many(locales),
  countries: many(countries),
  networkGroup: one(networkGroups, {
    fields: [brands.networkGroupId],
    references: [networkGroups.id],
  }),
}));

export const localesRelations = relations(locales, ({ one }) => ({
  brand: one(brands, {
    fields: [locales.brandId],
    references: [brands.id],
  }),
}));

export const countriesRelations = relations(countries, ({ one }) => ({
  brand: one(brands, {
    fields: [countries.brandId],
    references: [brands.id],
  }),
}));

export const brandColorsRelations = relations(brandColors, ({ one }) => ({
  brand: one(brands, {
    fields: [brandColors.brandId],
    references: [brands.id],
  }),
}));

export const brandTypographyRelations = relations(
  brandTypography,
  ({ one }) => ({
    brand: one(brands, {
      fields: [brandTypography.brandId],
      references: [brands.id],
    }),
  })
);

/**
 * TypeScript Types
 */
export type NetworkGroup = InferSelectModel<typeof networkGroups>;
export type Brand = InferSelectModel<typeof brands>;
export type Locale = InferSelectModel<typeof locales>;
export type Country = InferSelectModel<typeof countries>;
export type BrandColor = InferSelectModel<typeof brandColors>;
export type BrandTypography = InferSelectModel<typeof brandTypography>;
