import { NextResponse } from "next/server";
import { db } from "../../../db";
import { locales, brands } from "../../../db/design-tokens-schema";
import { brandDetails } from "../../data/brands";
import { eq } from "drizzle-orm";

export async function POST() {
  console.log("🚀 Starting migration of locales and countries...");

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
      updates.push({ brand, locale, country, status: "added" });
    } else {
      console.log(
        `🔹 Locale and country already assigned for "${brand}". Skipping.`
      );
      updates.push({ brand, locale, country, status: "skipped" });
    }
  }

  console.log("🎉 Locale migration complete!");

  return NextResponse.json({
    success: true,
    message: "Locales and countries updated for all brands.",
    updates,
  });
}
