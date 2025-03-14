import { NextResponse } from "next/server";
import { db } from "../../../db";
import {
  networkGroups,
  brands,
  locales,
  brandColors,
} from "../../../db/design-tokens-schema";
import { eq, inArray } from "drizzle-orm";
import fetch from "node-fetch";

const FIGMA_TOKEN = process.env.FIGMA_API_KEY!;
const FILE_KEY = "d7n9iZ8nIf8AsfiWsDVzM9";
const FIGMA_VARIABLES_URL = `https://api.figma.com/v1/files/${FILE_KEY}/variables`;

/**
 * Convert "#RRGGBB" to a Figma color object {r,g,b} in 0..1
 */
function hexToFigmaColor(hex: string) {
  const clean = hex.replace(/^#/, "");
  const num = parseInt(clean, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return { r: r / 255, g: g / 255, b: b / 255 };
}

/**
 * Builds the correct Figma request body with:
 * - Collections per Network Group
 * - Modes per Brand + Locale
 * - Color Variables under `palette/brand`
 */
async function buildFigmaRequestBody() {
  // Get network groups
  const networkGroupRows = await db.select().from(networkGroups);
  if (!networkGroupRows.length) {
    console.log("No network groups in DB, nothing to sync.");
    return null;
  }

  // Get brands, locales, and colors
  const brandRows = await db
    .select({
      id: brands.id,
      name: brands.name,
      networkGroupId: brands.networkGroupId,
    })
    .from(brands);
  const brandIds = brandRows.map((b) => b.id);
  const localeRows = await db
    .select({ brandId: locales.brandId, country: locales.country })
    .from(locales)
    .where(inArray(locales.brandId, brandIds));
  const colorRows = await db
    .select({ brandId: brandColors.brandId, hex: brandColors.hex })
    .from(brandColors)
    .where(inArray(brandColors.brandId, brandIds));

  // Determine the max number of colors across all brands
  const maxColorsByBrand = colorRows.reduce((acc, { brandId }) => {
    acc[brandId] = (acc[brandId] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  const maxColors = Math.max(...Object.values(maxColorsByBrand), 1);

  // Prepare the Figma API payload
  const variableCollections: any[] = [];
  const variableModes: any[] = [];
  const variables: any[] = [];
  const variableModeValues: any[] = [];

  for (const networkGroup of networkGroupRows) {
    const brandsInGroup = brandRows.filter(
      (b) => b.networkGroupId === networkGroup.id
    );
    if (!brandsInGroup.length) continue;

    // Create a collection per network group
    const collectionName = networkGroup.name;
    const tempCollectionId = `tmp_coll_${networkGroup.id}`;
    variableCollections.push({
      action: "CREATE",
      id: tempCollectionId,
      name: collectionName,
    });

    for (const brand of brandsInGroup) {
      const brandLocales = localeRows.filter((l) => l.brandId === brand.id);
      if (!brandLocales.length) continue;

      // Create a mode for each brand + locale
      for (const { country } of brandLocales) {
        const modeName = `${brand.name} ${country}`;
        const tempModeId = `tmp_mode_${brand.id}_${country}`;
        variableModes.push({
          action: "CREATE",
          id: tempModeId,
          name: modeName,
          variableCollectionId: tempCollectionId,
        });
      }
    }

    // Create color variables under `palette/brand`
    for (let i = 1; i <= maxColors; i++) {
      const varName = `palette/brand/${i}`;
      const tempVarId = `tmp_var_${networkGroup.id}_${i}`;

      // Ensure we only create this variable once per network group
      if (!variables.find((v) => v.id === tempVarId)) {
        variables.push({
          action: "CREATE",
          id: tempVarId,
          name: varName,
          resolvedType: "COLOR",
          variableCollectionId: tempCollectionId,
        });
      }

      // Assign colors to the correct mode
      for (const brand of brandsInGroup) {
        const brandLocales = localeRows.filter((l) => l.brandId === brand.id);
        const brandColors = colorRows.filter((c) => c.brandId === brand.id);
        const colorHex = brandColors[i - 1]?.hex || "#FFFFFF"; // Fallback to white

        for (const { country } of brandLocales) {
          const modeName = `${brand.name} ${country}`;
          const modeId = `tmp_mode_${brand.id}_${country}`;

          variableModeValues.push({
            variableId: tempVarId,
            modeId,
            value: hexToFigmaColor(colorHex),
          });
        }
      }
    }
  }

  return {
    variableCollections,
    variableModes,
    variables,
    variableModeValues,
  };
}

/**
 * Send the request to Figma
 */
async function postAllToFigma() {
  const body = await buildFigmaRequestBody();
  if (!body) {
    console.log("Nothing to sync.");
    return;
  }

  console.log("Final request body to Figma:", JSON.stringify(body, null, 2));

  const resp = await fetch(FIGMA_VARIABLES_URL, {
    method: "POST",
    headers: {
      "X-Figma-Token": FIGMA_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await resp.text();
  console.log("Figma POST response:", text);

  if (!resp.ok) {
    throw new Error(`Figma responded with error: ${text}`);
  }
}

/**
 * Next.js API Route
 */
export async function POST() {
  try {
    await postAllToFigma();
    return NextResponse.json({
      success: true,
      message: "Synced network groups with nested brands and colors.",
    });
  } catch (err) {
    console.error("❌ Error in sync route:", err);
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
