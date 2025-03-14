import { db } from "../../db";
import { locales, brands } from "../../db/design-tokens-schema";
import { brandDetails } from "../data/brands";
import { eq } from "drizzle-orm";

async function migrateLocales() {
  console.log("🚀 Starting migration of locales and countries...");

  for (const { brand, locale, country } of brandDetails) {
    if (!brand || !locale || !country) continue;

    // Find brand ID
    const [existingBrand] = await db
      .select({ id: brands.id })
      .from(brands)
      .where(eq(brands.name, brand))
      .limit(1);

    if (!existingBrand) {
      console.warn(`⚠️ Brand "${brand}" not found in database. Skipping.`);
      continue;
    }

    const brandId = existingBrand.id;

    // Check if locale-country mapping already exists
    const existingEntry = await db
      .select()
      .from(locales)
      .where(eq(locales.brandId, brandId))
      .limit(1);

    if (existingEntry.length === 0) {
      // Insert locale and country
      await db.insert(locales).values({
        brandId,
        locale,
        country,
      });
      console.log(
        `✅ Added locale "${locale}" and country "${country}" for "${brand}"`
      );
    } else {
      console.log(
        `🔹 Locale and country already assigned for "${brand}". Skipping.`
      );
    }
  }

  console.log("🎉 Locale migration complete!");
}

// Execute script
migrateLocales()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  });
