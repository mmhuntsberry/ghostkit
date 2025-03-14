import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";

/**
 * Brands Table
 * Stores basic info about each brand, e.g., "Best Products" or "Oprah Daily"
 */
export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // e.g. oprah-daily, best-products
  // More brand metadata if needed (e.g. isActive, domain, etc.)
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
  colorName: text("color_name").notNull(), // e.g. brandColorPrimary
  hexValue: text("hex_value").notNull(), // #1C1C9B
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Brand Typography
 * Future table for storing typography tokens (fontFamily, fontWeight, lineHeight, etc.)
 */
export const brandTypography = pgTable("brand_typography", {
  id: serial("id").primaryKey(),
  brandId: integer("brand_id")
    .references(() => brands.id, { onDelete: "cascade" })
    .notNull(),
  tokenName: text("token_name").notNull(), // e.g. 'heading-lg', 'body-sm'
  fontFamily: text("font_family"),
  fontWeight: integer("font_weight"),
  lineHeight: text("line_height"), // or numeric if you prefer
  letterSpacing: text("letter_spacing"), // or numeric
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Brand Buttons
 * Future table for storing button properties from Storybook (color, radius, etc.)
 */
export const brandButtons = pgTable("brand_buttons", {
  id: serial("id").primaryKey(),
  brandId: integer("brand_id")
    .references(() => brands.id, { onDelete: "cascade" })
    .notNull(),
  variantName: text("variant_name").notNull(), // e.g. 'primary', 'secondary'
  backgroundHex: text("background_hex"),
  textHex: text("text_hex"),
  borderHex: text("border_hex"),
  borderRadius: text("border_radius"), // e.g. '4px', '8px'
  // Add more properties as needed: padding, fontSize, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Relations
 */
export const brandsRelations = relations(brands, ({ many }) => ({
  colors: many(brandColors),
  typography: many(brandTypography),
  buttons: many(brandButtons),
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

export const brandButtonsRelations = relations(brandButtons, ({ one }) => ({
  brand: one(brands, {
    fields: [brandButtons.brandId],
    references: [brands.id],
  }),
}));

/**
 * TypeScript Types
 */
export type Brand = InferSelectModel<typeof brands>;
export type BrandColor = InferSelectModel<typeof brandColors>;
export type BrandTypography = InferSelectModel<typeof brandTypography>;
export type BrandButton = InferSelectModel<typeof brandButtons>;
