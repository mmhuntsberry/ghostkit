// apps/figma-rest-test/scripts/generate-brand-css.ts

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import "dotenv/config";

// 1) Import the *Neon-HTTP* variant of drizzle
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// 2) Import your Drizzle schema
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";

// ─────── STEP 0: ENVIRONMENT CHECK ───────
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
if (!process.env.BRAND_SLUG) throw new Error("BRAND_SLUG is required");

// ─────── STEP 1: INSTANTIATE DRIZZLE w/ Neon HTTP ───────
const client = neon(process.env.DATABASE_URL!); // NeonQueryFunction<...>
const db = drizzle(client, { schema, casing: "snake_case" });

// ─────── STEP 2: FETCH THE JSONB “tokens” COLUMN FROM `brands` ───────
async function fetchTokens(slug: string) {
  const rows = await db
    .select({ tokens: schema.brands.tokens })
    .from(schema.brands)
    .where(eq(schema.brands.slug, slug));

  if (rows.length === 0) {
    throw new Error(`No brand found with slug='${slug}'`);
  }
  return rows[0].tokens as Record<string, any>;
}

// ─────── STEP 3: FLATTEN THE NESTED JSON → CSS VARIABLES ───────
function flattenToCss(
  obj: Record<string, any>,
  path: string[] = []
): Record<string, string> {
  let result: Record<string, string> = {};

  for (const [key, val] of Object.entries(obj)) {
    const newPath = [...path, key];

    // If this node has a “$value” field, treat it as a leaf token.
    if (val && typeof val === "object" && "$value" in val) {
      const varName = newPath.join("-").toLowerCase();
      result[`--${varName}`] = String((val as any).$value);
    }
    // Otherwise, if it’s an object without “$value”, recurse deeper.
    else if (val && typeof val === "object") {
      Object.assign(result, flattenToCss(val as any, newPath));
    }
    // If it’s a primitive at top level (unlikely in our “design-token” shape), still emit:
    else {
      const varName = newPath.join("-").toLowerCase();
      result[`--${varName}`] = String(val);
    }
  }

  return result;
}

// ─────── STEP 4: MAIN; FETCH + WRITE THE .CSS FILE ───────
(async () => {
  try {
    const slug = process.env.BRAND_SLUG!;
    console.log(`⏳ Fetching tokens for slug='${slug}' from Postgres…`);

    const tokens = await fetchTokens(slug);
    console.log("✅ Tokens loaded, flattening into CSS variables…");

    const flatMap = flattenToCss(tokens);

    // Build the CSS text:
    let cssText = `:root {\n`;
    for (const [varName, value] of Object.entries(flatMap)) {
      cssText += `  ${varName}: ${value};\n`;
    }
    cssText += `}\n\n:host {\n`;
    for (const [varName, value] of Object.entries(flatMap)) {
      cssText += `  ${varName}: ${value};\n`;
    }
    cssText += `}\n`;

    // Ensure `public/brands/` exists, then write `slug.css`
    const outDir = join(process.cwd(), "public/brands");
    const outPath = join(outDir, `${slug}.css`);

    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true });
    }

    writeFileSync(outPath, cssText);
    console.log(`✅ Wrote CSS → ${outPath}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error generating brand CSS:", err);
    process.exit(1);
  }
})();
