import { InferSelectModel, relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  numeric,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

// Enums for issue status and priority
export const statusEnum = pgEnum("status", [
  "backlog",
  "todo",
  "in_progress",
  "done",
]);
export const priorityEnum = pgEnum("priority", ["low", "medium", "high"]);

// Issues table
export const issues = pgTable("issues", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: statusEnum("status").default("backlog").notNull(),
  priority: priorityEnum("priority").default("medium").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  userId: text("user_id").notNull(),
});

// Users table
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations between tables
export const issuesRelations = relations(issues, ({ one }) => ({
  user: one(users, {
    fields: [issues.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  issues: many(issues),
}));

// Types
export type Issue = InferSelectModel<typeof issues>;
export type User = InferSelectModel<typeof users>;

// Status and priority labels for display
export const ISSUE_STATUS = {
  backlog: { label: "Backlog", value: "backlog" },
  todo: { label: "Todo", value: "todo" },
  in_progress: { label: "In Progress", value: "in_progress" },
  done: { label: "Done", value: "done" },
};

export const ISSUE_PRIORITY = {
  low: { label: "Low", value: "low" },
  medium: { label: "Medium", value: "medium" },
  high: { label: "High", value: "high" },
};

/**
 * Stories
 */

export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  scenario: text("scenario").notNull(),
  childName: text("child_name").notNull(),
  age: integer("age").notNull(),
  pronouns: text("pronouns").default("they/them"),
  specialNeedsDetails: text("special_needs_details"),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),

  isPublic: boolean("is_public").default(false),
  isListed: boolean("is_listed").default(false),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const storiesRelations = relations(stories, ({ one, many }) => ({
  owner: one(users, {
    fields: [stories.userId],
    references: [users.id],
  }),
  pages: many(storyPages),
}));

export type Story = InferSelectModel<typeof stories>;

/**
 * Story Pages
 */

export const storyPages = pgTable("story_pages", {
  id: serial("id").primaryKey(),
  storyId: integer("story_id")
    .references(() => stories.id, { onDelete: "cascade" })
    .notNull(),
  pageNumber: integer("page_number").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),

  imageSource: text("image_source", {
    enum: ["cloudinary", "unsplash", "pexels", "upload"],
  }),
  imageExternalId: text("image_external_id"), // external id for cloudinary or other APIs

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const storyPagesRelations = relations(storyPages, ({ one }) => ({
  story: one(stories, {
    fields: [storyPages.storyId],
    references: [stories.id],
  }),
}));

export type StoryPage = InferSelectModel<typeof storyPages>;

/**
 * Images
 */

export const images = pgTable("images", {
  id: serial("id").primaryKey(),
  ownerId: text("owner_id").references(() => users.id),

  source: text("source").notNull(), // cloudinary, unsplash, pexels, upload
  externalId: text("external_id"), // for cloudinary or other services
  url: text("url").notNull(),
  altText: text("alt"),

  uploadedAt: timestamp("created_at").defaultNow().notNull(),
});

export type Image = InferSelectModel<typeof images>;

/**
 * Marketplace Listings
 */

export const marketplaceListings = pgTable("marketplace_listings", {
  id: serial("id").primaryKey(),
  storyId: integer("story_id")
    .references(() => stories.id, { onDelete: "cascade" })
    .notNull(),
  price: integer("price").default(0), // price in cents
  description: text("description"),
  tags: text("tags").array(),
  isActive: boolean("is_active").default(true),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const marketplaceRelations = relations(
  marketplaceListings,
  ({ one }) => ({
    story: one(stories, {
      fields: [marketplaceListings.storyId],
      references: [stories.id],
    }),
  })
);

export type MarketplaceListing = InferSelectModel<typeof marketplaceListings>;
