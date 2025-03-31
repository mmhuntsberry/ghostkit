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
import dotenv from "dotenv";

dotenv.config();

/**
 * Convert "#RRGGBB" to { r, g, b, a } in the range [0..1].
 */
function hexToFigmaColor(hex: string) {
  const clean = hex.replace(/^#/, "");
  const num = parseInt(clean, 16);
  return {
    r: ((num >> 16) & 255) / 255,
    g: ((num >> 8) & 255) / 255,
    b: (num & 255) / 255,
    a: 1,
  };
}

/**
 * Build an ephemeral ID for Figma:
 * - Must start with "TEMP_ID:"
 * - Only letters, digits, underscores, hyphens allowed after that.
 */
function makeEphemeralId(prefix: string, raw: string) {
  const sanitized = raw.replace(/[^A-Za-z0-9_-]+/g, "");
  return `TEMP_ID:${prefix}_${sanitized}`;
}

/**
 * Next.js API route:
 *  1) Creates a variable collection for each network group.
 *  2) Creates a mode for each brand-locale, ensuring that if a brand has no locales,
 *     it uses `[ { brandId, country: "Default" } ]`.
 *  3) If brand has no real colors, add a fallback color "palette/BrandName/default" (#CCCCCC).
 *  4) Assigns color values in each brand-locale mode.
 *
 * No brand is skipped. Even brands with no locale or no colors get a fallback mode/color.
 */
export async function POST() {
  try {
    const FIGMA_API_KEY = process.env.FIGMA_API_KEY!;
    const FILE_KEY = process.env.FILE_ID!;
    const FIGMA_VARIABLES_URL = `https://api.figma.com/v1/files/${FILE_KEY}/variables`;

    // 1) Fetch data from DB
    const networkGroupRows = await db.select().from(networkGroups);
    if (!networkGroupRows.length) {
      return NextResponse.json({
        success: true,
        message: "No network groups found; nothing to sync.",
      });
    }

    const brandRows = await db
      .select({
        id: brands.id,
        name: brands.name,
        networkGroupId: brands.networkGroupId,
      })
      .from(brands);

    const brandIds = brandRows.map((b) => b.id);

    // local locale rows for brand-locale
    const localeRows = await db
      .select({ brandId: locales.brandId, country: locales.country })
      .from(locales)
      .where(inArray(locales.brandId, brandIds));

    // brand colors
    const colorRows = await db
      .select({
        brandId: brandColors.brandId,
        dbName: brandColors.name, // e.g. "palette/brand/1"
        hex: brandColors.hex,
      })
      .from(brandColors)
      .where(inArray(brandColors.brandId, brandIds));

    // Arrays for single Figma POST
    const variableCollections: any[] = [];
    const variableModes: any[] = [];
    const variables: any[] = [];
    const variableModeValues: any[] = [];

    // Track ephemeral collection IDs for each network group
    const collectionEphemeralMap: Record<string, string> = {};

    // Helper to unify brand-locale logic
    function getLocaleList(brandId: number) {
      // All locale rows for the brand
      const brandLocaleRows = localeRows.filter((l) => l.brandId === brandId);
      if (!brandLocaleRows.length) {
        // No locale found => return a fallback
        return [{ brandId, country: "Default" }];
      }

      // If localeRows exist but some row has an empty or null country, fix that
      return brandLocaleRows.map((lr) => {
        const c = lr.country?.trim();
        if (!c) {
          return { brandId, country: "Default" };
        }
        return lr;
      });
    }

    // 2) Build ephemeral actions
    for (const ng of networkGroupRows) {
      // If no ephemeral ID for this group, create one
      if (!collectionEphemeralMap[ng.name]) {
        const collId = makeEphemeralId("coll", String(ng.id));
        collectionEphemeralMap[ng.name] = collId;

        variableCollections.push({
          action: "CREATE",
          id: collId,
          name: ng.name,
        });
      }

      const collEphemeralId = collectionEphemeralMap[ng.name];

      // Filter brands for this group
      const brandsInGroup = brandRows.filter((b) => b.networkGroupId === ng.id);
      if (!brandsInGroup.length) continue;

      for (const brand of brandsInGroup) {
        // 3) Get brand-locale list (may fallback to "Default" if none)
        const localeList = getLocaleList(brand.id);

        // Create modes for each locale
        for (const { country } of localeList) {
          const modeEphemeralId = makeEphemeralId(
            "mode",
            `${brand.id}_${country}`
          );
          variableModes.push({
            action: "CREATE",
            id: modeEphemeralId,
            name: `${brand.name} - ${country}`, // e.g. "Oprah Daily - Default"
            variableCollectionId: collEphemeralId,
          });
        }

        // 4) Find brand colors
        let brandColorsForBrand = colorRows.filter(
          (c) => c.brandId === brand.id
        );

        // If brand has no colors, add fallback
        if (!brandColorsForBrand.length) {
          const brandNameSanitized = brand.name.replace(/\W+/g, "_");
          brandColorsForBrand = [
            {
              brandId: brand.id,
              dbName: `palette/${brandNameSanitized}/default`,
              hex: "#CCCCCC",
            },
          ];
        }

        // Create variables for real or fallback color
        for (const bc of brandColorsForBrand) {
          const varEphemeralId = makeEphemeralId(`var_${brand.id}`, bc.dbName);

          variables.push({
            action: "CREATE",
            id: varEphemeralId,
            name: bc.dbName, // slash-based => "palette/Oprah_Daily/default"
            resolvedType: "COLOR",
            variableCollectionId: collEphemeralId,
          });

          // 5) Assign color to each locale's mode
          for (const { country } of localeList) {
            const modeEphemeralId = makeEphemeralId(
              "mode",
              `${brand.id}_${country}`
            );
            variableModeValues.push({
              action: "UPDATE",
              variableId: varEphemeralId,
              modeId: modeEphemeralId,
              value: hexToFigmaColor(bc.hex),
              valueType: "COLOR",
            });
          }
        }
      }
    }

    // 6) If nothing to do, short-circuit
    if (
      !variableCollections.length &&
      !variableModes.length &&
      !variables.length &&
      !variableModeValues.length
    ) {
      return NextResponse.json({
        success: true,
        message: "No data to sync. Possibly all up-to-date.",
      });
    }

    const figmaPayload = {
      variableCollections,
      variableModes,
      variables,
      variableModeValues,
    };

    console.log(
      "Figma single-request payload:",
      JSON.stringify(figmaPayload, null, 2)
    );

    // 7) POST to Figma
    const response = await fetch(FIGMA_VARIABLES_URL, {
      method: "POST",
      headers: {
        "X-Figma-Token": FIGMA_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(figmaPayload),
    });

    const responseText = await response.text();
    if (!response.ok) {
      console.error("❌ Figma responded with an error:", responseText);
      throw new Error(responseText);
    }

    console.log("✅ Figma single-request sync success:", responseText);
    return NextResponse.json({
      success: true,
      message:
        "✅ Created collections, modes (with fallback locale), and brand color variables (with fallback color) in a single request.",
    });
  } catch (err) {
    console.error("❌ Sync error:", err);
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
