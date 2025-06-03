// apps/figma-rest-test/scripts/export-to-neon.ts

/**
 * 1) Reads variables from Figma
 * 2) Generates nested JSON tokens → writes each {collection}.{mode}.json locally
 * 3) Upserts each collection+mode’s JSON into `brands` table tokens JSONB column,
 *    using a slug that includes both collection name and mode name to avoid collisions.
 */

import fs from "fs";
import path from "path";
import axios from "axios";
import "dotenv/config";

// --- 0. ENVIRONMENT & SETUP ---
if (!process.env.FIGMA_API_KEY) {
  throw new Error("FIGMA_API_KEY env var required (Figma access token).");
}
if (!process.env.FIGMA_FILE_ID) {
  throw new Error("FIGMA_FILE_ID env var required (Figma file key).");
}
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL env var required (Neon connection string).");
}

const FIGMA_API_KEY = process.env.FIGMA_API_KEY;
const FIGMA_FILE_ID = process.env.FIGMA_FILE_ID;
const BASE_URL = "https://api.figma.com";
const OUTPUT_DIR = path.resolve("tokens_new"); // Where JSON files go

// --- 1. FIGMA API CLASS ---
class FigmaApi {
  private token: string;
  private baseUrl: string;

  constructor(token: string) {
    this.token = token;
    this.baseUrl = BASE_URL;
  }

  async getLocalVariables(fileKey: string) {
    const resp = await axios.get(
      `${this.baseUrl}/v1/files/${fileKey}/variables/local`,
      {
        headers: {
          "X-Figma-Token": this.token,
          Accept: "*/*",
        },
      }
    );
    return resp.data;
  }
}

// --- 2. COLOR HELPERS ---
function rgbaToHex({
  r,
  g,
  b,
  a,
}: {
  r: number;
  g: number;
  b: number;
  a?: number;
}) {
  const toHex = (val: number) =>
    Math.round(val * 255)
      .toString(16)
      .padStart(2, "0");
  const base = `${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  return a === undefined || a === 1
    ? `#${base}`
    : `#${base}${toHex(a).toUpperCase()}`;
}

function tokenTypeFromResolvedType(resolvedType: string) {
  switch (resolvedType) {
    case "COLOR":
      return "color";
    case "FLOAT":
      return "number";
    case "STRING":
      return "string";
    case "BOOLEAN":
      return "boolean";
    default:
      return "string";
  }
}

function tokenValueFromVariable(
  variable: any,
  modeId: string,
  localVars: Record<string, any>
): any {
  const val = variable.valuesByMode[modeId];
  if (typeof val === "object") {
    if ("type" in val && val.type === "VARIABLE_ALIAS") {
      const aliasedVar = localVars[val.id];
      if (!aliasedVar) return "";
      return `{${aliasedVar.name.replace(/\//g, ".")}}`;
    } else if ("r" in val) {
      return rgbaToHex(val as { r: number; g: number; b: number; a?: number });
    } else {
      return val;
    }
  }
  return val;
}

function assignNestedToken(
  tokensFile: Record<string, any>,
  tokenName: string,
  token: any
) {
  const parts = tokenName.split("/");
  let current: Record<string, any> = tokensFile;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]]) current[parts[i]] = {};
    current = current[parts[i]];
  }
  current[parts[parts.length - 1]] = token;
}

/**
 * Builds an object of token files.
 * For each Figma variable (local only) in a collection, create or append
 * to a token file named "{collectionName}.{modeName}.json". The token's location
 * in the JSON is determined by splitting its name on "/".
 */
function tokenFilesFromLocalVariables(localVarsResponse: any) {
  const tokenFiles: Record<string, Record<string, any>> = {};
  const collections = localVarsResponse.meta.variableCollections;
  const variables = localVarsResponse.meta.variables;

  Object.values(variables).forEach((variable: any) => {
    if (variable.remote) return; // skip remote variables
    const collection = collections[variable.variableCollectionId];
    if (!collection) return;
    collection.modes.forEach((mode: any) => {
      const fileName = `${collection.name}.${mode.name}.json`;
      if (!tokenFiles[fileName]) tokenFiles[fileName] = {};
      const token = {
        $type: tokenTypeFromResolvedType(variable.resolvedType),
        $value: tokenValueFromVariable(variable, mode.modeId, variables),
        $description: variable.description || "",
        $extensions: {
          "com.figma": {
            hiddenFromPublishing: variable.hiddenFromPublishing || false,
            scopes: variable.scopes || [],
            codeSyntax: variable.codeSyntax || {},
          },
        },
      };
      assignNestedToken(tokenFiles[fileName], variable.name, token);
    });
  });

  return tokenFiles;
}

// --- 3. WRITE TOKENS FILES LOCALLY ---
function writeTokensFiles(
  files: Record<string, Record<string, any>>,
  outputDir: string
) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  Object.entries(files).forEach(([fileName, tokensFile]) => {
    const filePath = path.join(outputDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(tokensFile, null, 2));
    console.log(`Wrote ${filePath}`);
  });
}

// --- 4. Drizzle / Neon Setup ---
import { db, schema } from "../db/index";
import { eq } from "drizzle-orm";

// Upsert logic: find by slug, insert if missing, otherwise update.
async function upsertBrandTokens(slug: string, fullJsonObject: unknown) {
  // 1) Try to find existing brand by slug
  const existing = await db
    .select({ id: schema.brands.id })
    .from(schema.brands)
    .where(eq(schema.brands.slug, slug));

  if (existing.length === 0) {
    // Insert a brand record if none exists
    await db.insert(schema.brands).values({
      name: slug,
      slug: slug,
      tokens: fullJsonObject,
    });
    console.log(`Inserted brand record for slug='${slug}'`);
  } else {
    // Update tokens column if brand already exists
    await db
      .update(schema.brands)
      .set({
        tokens: fullJsonObject,
        updatedAt: new Date(),
      })
      .where(eq(schema.brands.id, existing[0].id));
    console.log(`Updated brand '${slug}' (id=${existing[0].id})`);
  }
}

// --- 5. MAIN ---
async function main() {
  try {
    // 5.1 Fetch Figma variables
    const figmaApi = new FigmaApi(FIGMA_API_KEY);
    console.log("Fetching local variables from Figma…");
    const localVars = await figmaApi.getLocalVariables(FIGMA_FILE_ID);
    console.log(
      "Collections found in Figma:",
      Object.values(localVars.meta.variableCollections).map((c: any) => c.name)
    );

    // 5.2 Build token JSON objects
    const tokensFiles = tokenFilesFromLocalVariables(localVars);

    // 5.3 Write JSON files locally
    writeTokensFiles(tokensFiles, OUTPUT_DIR);

    // 5.4 Upsert each collection+mode into the DB
    console.log("Upserting into database…");
    for (const [fileName, tokenObj] of Object.entries(tokensFiles)) {
      // fileName is e.g. "alias.White Label.json"
      const [collectionName, modeName] = fileName.split(".");
      // Include both collectionName and modeName in slug to avoid collisions
      const slug = `${collectionName.toLowerCase()}-${modeName.toLowerCase()}`;
      await upsertBrandTokens(slug, tokenObj);
    }

    console.log("\n✅ Sync complete: files written + DB updated.\n");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

main();
