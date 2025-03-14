import { db } from "./";
import {
  networkGroups,
  brands,
  brandColors,
  brandTypography,
} from "./design-tokens-schema";
import { eq, and } from "drizzle-orm";

/**
 * Saves scraped brand data into the database.
 */
export async function saveScrapedData(
  brandName: string,
  slug: string,
  colors: Array<{ name: string; hex: string }>,
  fonts: Array<{ category: string; fontFamily: string }>,
  locale: string | null,
  country: string | null,
  networkGroupName: string | null
) {
  // Upsert Network Group
  let networkGroupId: number | null = null;
  if (networkGroupName) {
    const [existingNetworkGroup] = await db
      .select()
      .from(networkGroups)
      .where(eq(networkGroups.name, networkGroupName))
      .limit(1);

    if (!existingNetworkGroup) {
      const [insertedGroup] = await db
        .insert(networkGroups)
        .values({ name: networkGroupName })
        .returning({ id: networkGroups.id });

      networkGroupId = insertedGroup?.id ?? null;
    } else {
      networkGroupId = existingNetworkGroup.id;
    }
  }

  // Upsert Brand with Network Group & Locale
  const [existingBrand] = await db
    .select()
    .from(brands)
    .where(eq(brands.slug, slug))
    .limit(1);

  let brandId: number;
  if (!existingBrand) {
    const [insertedBrand] = await db
      .insert(brands)
      .values({
        name: brandName,
        slug,
        networkGroupId,
        locale, // Store locale info
        country, // Store country info
      })
      .returning({ id: brands.id });

    brandId = insertedBrand.id;
  } else {
    brandId = existingBrand.id;
  }

  // Insert Colors (Prevent Duplicates)
  let colorIndex = 1;
  for (const color of colors) {
    const existingColor = await db
      .select()
      .from(brandColors)
      .where(
        and(eq(brandColors.brandId, brandId), eq(brandColors.hex, color.hex))
      )
      .limit(1);

    if (!existingColor.length) {
      await db
        .insert(brandColors)
        .values({
          brandId,
          name: `palette/brand/${colorIndex}`, // Sequential numbering
          hex: color.hex,
        })
        .onConflictDoNothing();
      colorIndex++;
    }
  }

  // Insert Typography (Prevent Duplicates)
  for (const font of fonts) {
    const existingTypography = await db
      .select()
      .from(brandTypography)
      .where(
        and(
          eq(brandTypography.brandId, brandId),
          eq(brandTypography.value, font.fontFamily)
        )
      )
      .limit(1);

    if (!existingTypography.length) {
      await db
        .insert(brandTypography)
        .values({
          brandId,
          name: `font/family/${font.category
            .replace(/\s+/g, "-")
            .toLowerCase()}`,
          value: font.fontFamily,
        })
        .onConflictDoNothing();
    }
  }

  console.log(`✅ Synced data for brand: ${brandName} (${locale || "Global"})`);
}
