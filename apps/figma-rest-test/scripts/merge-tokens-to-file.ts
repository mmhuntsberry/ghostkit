import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import deepmerge from "deepmerge";
import * as schema from "../db/schema";
import "dotenv/config";

const {
  DATABASE_URL,
  BRAND_SLUG,
  PRIMITIVES_SLUG = "primitives-white label",
} = process.env;
if (!DATABASE_URL) throw new Error("DATABASE_URL is required");
if (!BRAND_SLUG) throw new Error("BRAND_SLUG is required");

const db = drizzle(neon(DATABASE_URL), { schema, casing: "snake_case" });

async function loadTokens(slug: string) {
  const [row] = await db
    .select({ tokens: schema.brands.tokens })
    .from(schema.brands)
    .where(eq(schema.brands.slug, slug));
  if (!row) throw new Error(`No brand found with slug='${slug}'`);
  return row.tokens as Record<string, unknown>;
}

(async () => {
  const primitives = await loadTokens(PRIMITIVES_SLUG);
  const alias = await loadTokens(BRAND_SLUG);

  // Deep merge: alias takes precedence over primitives
  const merged = deepmerge(primitives, alias);

  // Optional: flatten or resolve references here if your tokens use {foo.bar} refs

  const outDir = "tokens_preprocessed";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, `${BRAND_SLUG}.json`);
  writeFileSync(outPath, JSON.stringify(merged, null, 2));
  console.log(`✅ Tokens written to ${outPath}`);
})();
