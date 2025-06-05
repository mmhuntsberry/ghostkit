import "dotenv/config";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import deepmerge from "deepmerge";
import { createRequire } from "node:module";
import * as schema from "../db/schema";

// ---- ESM/CJS magic ----
const require = createRequire(import.meta.url);
const StyleDictionary = require("style-dictionary");

// ---- ENV ----
const {
  DATABASE_URL,
  BRAND_SLUG,
  PRIMITIVES_SLUG = "primitives-white label",
} = process.env;
if (!DATABASE_URL) throw new Error("DATABASE_URL is required");
if (!BRAND_SLUG) throw new Error("BRAND_SLUG is required");

// ---- DB ----
const db = drizzle(neon(DATABASE_URL), { schema, casing: "snake_case" });
async function loadTokens(slug: string) {
  const [row] = await db
    .select({ tokens: schema.brands.tokens })
    .from(schema.brands)
    .where(eq(schema.brands.slug, slug));
  if (!row) throw new Error(`No brand found with slug='${slug}'`);
  return row.tokens as Record<string, unknown>;
}

// ---- MAIN ----
(async () => {
  console.log(
    `⏳ Loading tokens: primitives='${PRIMITIVES_SLUG}', brand='${BRAND_SLUG}'`
  );
  const primitives = await loadTokens(PRIMITIVES_SLUG);
  const alias = await loadTokens(BRAND_SLUG);
  const merged = deepmerge(primitives, alias);

  const SD = StyleDictionary.extend({
    tokens: merged,
    platforms: {
      css: {
        buildPath: "public/brands/",
        transforms: ["attribute/cti", "name/cti/kebab", "size/px", "color/css"],
        files: [
          {
            destination: `${BRAND_SLUG}.css`,
            format: "css/variables",
            options: { outputReferences: true },
          },
        ],
        resolveReferences: true,
      },
    },
  });

  console.log("🛠  Building CSS with Style Dictionary…");
  SD.buildAllPlatforms();

  // just in case SD didn't create it
  const abs = join(process.cwd(), "public/brands", `${BRAND_SLUG}.css`);
  if (!existsSync(abs)) {
    mkdirSync(join(process.cwd(), "public/brands"), { recursive: true });
  }
  console.log(`✅ Done → ${abs}`);
})();
