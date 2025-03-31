import { NextResponse } from "next/server";
import { db } from "../../../../db";
import {
  networkGroups,
  brands,
  locales,
  brandColors,
} from "../../../../db/design-tokens-schema";
import { eq, inArray } from "drizzle-orm";
import fetch from "node-fetch";

const FIGMA_API_KEY = process.env.FIGMA_API_KEY!;
const FILE_KEY = process.env.FILE_ID!;
const FIGMA_VARIABLES_URL = `https://api.figma.com/v1/files/${FILE_KEY}/variables`;

/**
 * Convert "#RRGGBB" to a Figma color object {r,g,b,a} in 0..1
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
 * Next.js API route: POST /api/sync-brands
 *
 * Builds one JSON body with:
 * 1) A CREATE collection for each network group (using ephemeral ID).
 * 2) A CREATE mode for each brand + locale.
 * 3) A CREATE variable for each brand color, converting "palette/brand/1" -> "palette.brand.1".
 * 4) An UPDATE action in variableModeValues to assign the color for each brand’s mode.
 *
 * All ephemeral IDs are used within this single request so that we don’t need multiple calls.
 */
export async function POST() {
  try {
    // 1) Fetch DB data
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

    const localeRows = await db
      .select({ brandId: locales.brandId, country: locales.country })
      .from(locales)
      .where(inArray(locales.brandId, brandIds));

    const colorRows = await db
      .select({
        brandId: brandColors.brandId,
        dbName: brandColors.name, // e.g. "palette/brand/1" in your DB
        hex: brandColors.hex,
      })
      .from(brandColors)
      .where(inArray(brandColors.brandId, brandIds));

    // 2) Prepare arrays for a single POST
    const variableCollections: any[] = [];
    const variableModes: any[] = [];
    const variables: any[] = [];
    const variableModeValues: any[] = [];

    // We'll track ephemeral IDs so we don't recreate the same collection for the same group
    const collectionEphemeralMap: Record<string, string> = {};

    // Also track brand-locale -> ephemeral mode ID so we don't duplicate modes
    // (In a single request, ephemeral IDs must be unique.)
    function getModeEphemeralId(brandId: number, country: string) {
      return `temp_mode_${brandId}_${country.replace(/\s+/g, "_")}`;
    }

    // 3) Build the actions for each network group
    for (const ng of networkGroupRows) {
      // Create a variable collection for each network group (if we haven't already)
      if (!collectionEphemeralMap[ng.name]) {
        const collId = `temp_coll_${ng.id}`;
        collectionEphemeralMap[ng.name] = collId;
        variableCollections.push({
          action: "CREATE",
          id: collId,
          name: ng.name, // The display name for the collection
        });
      }

      // Find all brands in this group
      const brandsInGroup = brandRows.filter((b) => b.networkGroupId === ng.id);
      if (!brandsInGroup.length) continue;

      const collEphemeralId = collectionEphemeralMap[ng.name];

      // For each brand => create modes for each locale
      for (const brand of brandsInGroup) {
        const brandLocaleRows = localeRows.filter(
          (l) => l.brandId === brand.id
        );
        const localeList = brandLocaleRows.length
          ? brandLocaleRows
          : [{ brandId: brand.id, country: "Default" }];

        for (const { country } of localeList) {
          const modeId = getModeEphemeralId(brand.id, country);
          variableModes.push({
            action: "CREATE",
            id: modeId,
            name: `${brand.name} - ${country}`, // user-friendly name
            variableCollectionId: collEphemeralId,
          });
        }

        // For each brand color => create a variable
        const brandColorsForBrand = colorRows.filter(
          (c) => c.brandId === brand.id
        );
        if (!brandColorsForBrand.length) continue;

        brandColorsForBrand.forEach((bc) => {
          // bc.dbName might be "palette/brand/1"
          // Convert slashes to dots => "palette.brand.1"
          // Or just remove the prefix to keep only "1" if you prefer.
          const figmaVarName = bc.dbName.replace(/\//g, ".");
          // e.g. "palette/brand/1" => "palette.brand.1"

          // We'll create an ephemeral ID like "temp_var_{brandId}_{bc.dbName}"
          // but remove slashes/spaces to keep it safe
          const safeDbName = bc.dbName.replace(/\W+/g, "_"); // e.g. "palette_brand_1"
          const varEphemeralId = `temp_var_${brand.id}_${safeDbName}`;

          // Push a CREATE action for the variable
          variables.push({
            action: "CREATE",
            id: varEphemeralId,
            name: figmaVarName,
            resolvedType: "COLOR",
            variableCollectionId: collEphemeralId,
          });

          // Then assign the color to each mode for that brand
          const brandLocaleRows = localeRows.filter(
            (l) => l.brandId === brand.id
          );
          const localList = brandLocaleRows.length
            ? brandLocaleRows
            : [{ brandId: brand.id, country: "Default" }];
          for (const { country } of localList) {
            variableModeValues.push({
              action: "UPDATE",
              variableId: varEphemeralId,
              modeId: getModeEphemeralId(brand.id, country),
              value: hexToFigmaColor(bc.hex),
              valueType: "COLOR",
            });
          }
        });
      }
    }

    // 4) If no actions, we’re done
    if (
      variableCollections.length === 0 &&
      variableModes.length === 0 &&
      variables.length === 0 &&
      variableModeValues.length === 0
    ) {
      return NextResponse.json({
        success: true,
        message: "No new data to sync. Possibly all up-to-date.",
      });
    }

    // 5) Build the single POST body
    const bodyToSend = {
      variableCollections,
      variableModes,
      variables,
      variableModeValues,
    };

    console.log(
      "Final single-request body =>",
      JSON.stringify(bodyToSend, null, 2)
    );

    // 6) Send it off to Figma
    const figmaResponse = await fetch(FIGMA_VARIABLES_URL, {
      method: "POST",
      headers: {
        "X-Figma-Token": FIGMA_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyToSend),
    });

    const figmaText = await figmaResponse.text();
    if (!figmaResponse.ok) {
      console.error("Figma responded with error:", figmaText);
      throw new Error(figmaText);
    }

    console.log("✅ Figma single-request sync success:", figmaText);
    return NextResponse.json({
      success: true,
      message: "Synced brand color variables in a single atomic request.",
    });
  } catch (err) {
    console.error("❌ Sync error:", err);
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
