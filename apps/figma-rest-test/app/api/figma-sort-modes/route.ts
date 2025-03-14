import { NextResponse } from "next/server";
import fetch from "node-fetch";

const FIGMA_TOKEN = process.env.FIGMA_API_KEY!;
const FILE_KEY = "d7n9iZ8nIf8AsfiWsDVzM9";
const FIGMA_VARIABLES_URL = `https://api.figma.com/v1/files/${FILE_KEY}/variables/local`;
const FIGMA_UPDATE_URL = `https://api.figma.com/v1/files/${FILE_KEY}/variables`;

/**
 * Fetches all variable collections and modes from Figma
 */
async function getFigmaCollections() {
  const response = await fetch(FIGMA_VARIABLES_URL, {
    method: "GET",
    headers: {
      "X-Figma-Token": FIGMA_TOKEN,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!data || data.error) {
    throw new Error(
      `Failed to fetch Figma variables: ${data?.message || "Unknown error"}`
    );
  }
  return data.meta.variableCollections;
}

/**
 * Sorts modes alphabetically for each **local** collection
 */
function sortModesAlphabetically(variableCollections: any) {
  const sortedModes: any[] = [];

  for (const collectionId in variableCollections) {
    const collection = variableCollections[collectionId];

    // **Skip remote collections**
    if (collection.remote) {
      console.log(`⚠️ Skipping remote collection: ${collection.name}`);
      continue;
    }

    const sortedModesInCollection = [...collection.modes].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    sortedModesInCollection.forEach((mode) => {
      sortedModes.push({
        action: "UPDATE",
        id: mode.modeId,
        name: mode.name,
        variableCollectionId: collectionId,
      });
    });
  }

  return sortedModes;
}

/**
 * Updates Figma with the new sorted modes
 */
async function updateFigmaModes(sortedModes: any[]) {
  if (sortedModes.length === 0) {
    console.log("✅ No local modes to update. Exiting.");
    return;
  }

  const response = await fetch(FIGMA_UPDATE_URL, {
    method: "POST",
    headers: {
      "X-Figma-Token": FIGMA_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ variableModes: sortedModes }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Failed to update Figma modes: ${data.message}`);
  }
  console.log(`✅ Successfully updated ${sortedModes.length} modes.`);
}

export async function POST() {
  try {
    console.log("🔄 Fetching variable collections...");
    const collections = await getFigmaCollections();

    console.log("🔠 Sorting modes alphabetically (local collections only)...");
    const sortedModes = sortModesAlphabetically(collections);

    console.log("📤 Updating Figma with sorted modes...");
    await updateFigmaModes(sortedModes);

    return NextResponse.json({
      success: true,
      message: "Modes sorted successfully in Figma.",
    });
  } catch (error) {
    console.error("❌ Error sorting modes:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
