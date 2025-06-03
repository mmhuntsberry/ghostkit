import { eq } from "drizzle-orm";
import { db } from "./index"; // your Drizzle client
import { brands } from "./design-tokens-schema"; // the table we just created

/**
 * Look up the numeric `id` for a given slug ("cosmopolitan"). Returns null if not found.
 */
export async function getBrandIdBySlug(slug: string): Promise<number | null> {
  const rows = await db
    .select({ id: brands.id })
    .from(brands)
    .where(eq(brands.slug, slug.toLowerCase()));

  return rows.length === 0 ? null : rows[0].id;
}

/**
 * Overwrite the `tokens` JSONB column for that brandId.
 * Also updates the `updatedAt` to now().
 */
export async function upsertBrandTokens(brandId: number, tokensJson: unknown) {
  await db
    .update(brands)
    .set({
      tokens: tokensJson,
      updatedAt: new Date(),
    })
    .where(eq(brands.id, brandId));
}
