import { NextResponse } from "next/server";
import { db } from "../../../db";
import { locales, brands } from "../../../db/design-tokens-schema";
import { brandDetails } from "../../data/brands";
import { eq, and } from "drizzle-orm";

export async function POST() {
  console.log("🔄 Updating locales and countries for brands...");

  let updates = [];

  for (const { brand, locale, country } of brandDetails) {
    if (!brand || !locale || !country) continue;

    // Find brand ID
    const [existingBrand] = await db
      .select({ id: brands.id })
      .from(brands)
      .where(eq(brands.name, brand))
      .limit(1);

    if (!existingBrand) {
      console.warn(`⚠️ Brand "${brand}" not found. Skipping.`);
      continue;
    }

    const brandId = existingBrand.id;

    // Check if this locale-country pair already exists for this brand
    const existingEntry = await db
      .select()
      .from(locales)
      .where(
        and(
          eq(locales.brandId, brandId),
          eq(locales.locale, locale),
          eq(locales.country, country)
        )
      )
      .limit(1);

    if (existingEntry.length === 0) {
      // Insert new locale-country pair
      await db.insert(locales).values({
        brandId,
        locale,
        country,
      });

      console.log(
        `✅ Added locale "${locale}" and country "${country}" for "${brand}"`
      );
      updates.push({ brand, locale, country, status: "added" });
    } else {
      console.log(
        `🔹 Locale "${locale}" and country "${country}" already exist for "${brand}". Skipping.`
      );
      updates.push({ brand, locale, country, status: "skipped" });
    }
  }

  console.log("🎉 Locale and country update complete!");

  return NextResponse.json({
    success: true,
    message: "Locales and countries updated for all brands.",
    updates,
  });
}
