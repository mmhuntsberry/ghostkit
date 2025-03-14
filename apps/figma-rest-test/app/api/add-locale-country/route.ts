import { NextResponse } from "next/server";
import { db } from "../../../db";
import { brands } from "../../../db/design-tokens-schema";
import { eq, and } from "drizzle-orm";

/**
 * POST request to add or update brand locale and country
 */
export async function POST(req: Request) {
  try {
    const { brand, locale, country } = await req.json();

    if (!brand) {
      return NextResponse.json(
        { success: false, error: "Brand name is required." },
        { status: 400 }
      );
    }

    // Check if the brand already exists in DB
    const [existingBrand] = await db
      .select()
      .from(brands)
      .where(eq(brands.name, brand))
      .limit(1);

    if (existingBrand) {
      // Update the brand with new locale and country if missing
      await db
        .update(brands)
        .set({
          locale: locale ?? existingBrand.locale,
          country: country ?? existingBrand.country,
        })
        .where(eq(brands.name, brand));

      console.log(
        `✅ Updated brand: ${brand} - Locale: ${locale}, Country: ${country}`
      );
    } else {
      // Insert new brand with locale and country
      await db.insert(brands).values({
        name: brand,
        slug: brand.toLowerCase().replace(/\s+/g, "-"),
        locale,
        country,
      });

      console.log(
        `🚀 Inserted new brand: ${brand} - Locale: ${locale}, Country: ${country}`
      );
    }

    return NextResponse.json({
      success: true,
      message: "Brand updated successfully.",
    });
  } catch (err) {
    console.error("❌ Error updating brand locale & country:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
