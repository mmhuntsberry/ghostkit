import fs from "fs";
import path from "path";
import fetch from "node-fetch";

const FILE_ID = process.env.FILE_ID;
const FIGMA_API_KEY = process.env.FIGMA_API_KEY;

const OUTPUT_DIR = path.resolve("packages/tokens");
const THEMES_DIR = path.join(OUTPUT_DIR, "themes");

if (!FILE_ID || !FIGMA_API_KEY) {
  console.error("❌ Missing FILE_ID or FIGMA_API_KEY");
  process.exit(1);
}

const headers = {
  "X-Figma-Token": FIGMA_API_KEY,
};

const VARIABLES_LOCAL = `https://api.figma.com/v1/files/${FILE_ID}/variables/local`;
const VARIABLES_PUBLISHED = `https://api.figma.com/v1/files/${FILE_ID}/variables/published`;

/**
 * Convert RGBA to hex string (#RRGGBB or #RRGGBBAA).
 */
function rgbaToHex({ r, g, b, a }) {
  const toHex = (val) =>
    Math.round(val * 255)
      .toString(16)
      .padStart(2, "0");

  const base = `${toHex(r)}${toHex(g)}${toHex(b)}`;
  return a === 1
    ? `#${base.toUpperCase()}`
    : `#${base}${toHex(a).toUpperCase()}`;
}

/**
 * Sets a nested token path: e.g. setNestedToken(obj, ['Color','Background'], value).
 */
function setNestedToken(obj, pathArray, value) {
  let current = obj;
  for (let i = 0; i < pathArray.length - 1; i++) {
    const key = pathArray[i];
    if (!current[key]) current[key] = {};
    current = current[key];
  }
  current[pathArray.at(-1)] = { value };
}

// Clean old output
if (fs.existsSync(THEMES_DIR)) {
  fs.rmSync(THEMES_DIR, { recursive: true, force: true });
}
if (fs.existsSync(path.join(OUTPUT_DIR, "primitives.json"))) {
  fs.rmSync(path.join(OUTPUT_DIR, "primitives.json"), { force: true });
}
fs.mkdirSync(THEMES_DIR, { recursive: true });

const fetchJSON = async (url) => {
  const res = await fetch(url, { headers });
  if (!res.ok) {
    console.error(`❌ Failed to fetch: ${url}`, res.statusText);
    process.exit(1);
  }
  return res.json();
};

(async () => {
  // 1) Fetch local & published variable data in parallel
  const [localData, publishedData] = await Promise.all([
    fetchJSON(VARIABLES_LOCAL),
    fetchJSON(VARIABLES_PUBLISHED),
  ]);

  // 2) Merge local & published variables into one array so we have *all* IDs
  const localVariables = Array.isArray(localData.meta.variables)
    ? localData.meta.variables
    : Object.values(localData.meta.variables);

  const publishedVariables = Array.isArray(publishedData.meta.variables)
    ? publishedData.meta.variables
    : Object.values(publishedData.meta.variables);

  const allVariables = [...localVariables, ...publishedVariables];

  // 3) Merge local & published variableCollections
  const localCollections = Array.isArray(localData.meta.variableCollections)
    ? localData.meta.variableCollections
    : Object.values(localData.meta.variableCollections);

  const publishedCollections = Array.isArray(
    publishedData.meta.variableCollections
  )
    ? publishedData.meta.variableCollections
    : Object.values(publishedData.meta.variableCollections);

  const allCollections = [...localCollections, ...publishedCollections];

  // Build a map: variableId -> variableName
  const idToName = {};
  for (const v of allVariables) {
    idToName[v.id] = v.name;
  }

  // Build a map: modeId -> modeName (from all collections)
  const modeIdToName = {};
  for (const collection of allCollections) {
    for (const mode of collection.modes || []) {
      modeIdToName[mode.id] = mode.name;
    }
  }

  // 4) We only want to create "primitives" from local variables
  //    (If you also want published variables included, loop over allVariables instead.)
  const variablesForPrimitives = localVariables;

  const primitives = {};
  const aliasesByModeName = {};

  for (const v of variablesForPrimitives) {
    const collection = allCollections.find(
      (c) => c.id === v.variableCollectionId
    );
    if (!collection) continue;

    // Decide on delimiter for name path
    const delimiter = v.name.includes("/") ? "/" : ".";
    // If you want to keep the entire variable path, remove `.slice(0, 3)` below.
    const namePath = v.name.split(delimiter).slice(0, 3);

    // 5) Handle default mode -> "primitives.json"
    const defaultModeId = collection.defaultModeId;
    const defaultValue = v.valuesByMode?.[defaultModeId];

    // If defaultValue is a direct value (e.g. COLOR, FLOAT, etc.), store in primitives
    if (defaultValue && defaultValue.type !== "VARIABLE_ALIAS") {
      const value =
        v.resolvedType === "COLOR" ? rgbaToHex(defaultValue) : defaultValue;
      setNestedToken(primitives, namePath, value);
    }

    // 6) For each mode that references another variable (alias), store reference in the “theme” JSON
    for (const [modeId, tokenValue] of Object.entries(v.valuesByMode || {})) {
      if (!tokenValue || tokenValue.type !== "VARIABLE_ALIAS") continue;

      // Convert modeId -> friendlyName
      const modeName = modeIdToName[modeId] || modeId;
      const safeModeName = modeName
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");

      if (!aliasesByModeName[safeModeName]) {
        aliasesByModeName[safeModeName] = {};
      }

      // Find the friendly name for the referenced variable
      const referencedName = idToName[tokenValue.id];
      if (!referencedName) {
        // If we still don't have a name, we skip; could happen if referencing an external library not in published data
        continue;
      }

      // Build path for the referenced name
      const refDelimiter = referencedName.includes("/") ? "/" : ".";
      const refPath = referencedName.split(refDelimiter).slice(0, 3);

      // Store alias token as a reference to the "primitives"
      setNestedToken(
        aliasesByModeName[safeModeName],
        namePath,
        `{${refPath.join(".")}}`
      );
    }
  }

  // 7) Write out primitives.json
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "primitives.json"),
    JSON.stringify(primitives, null, 2)
  );
  console.log("✅ Wrote primitives.json");

  // 8) Write out each mode’s theme file using the friendly mode name
  for (const [modeName, data] of Object.entries(aliasesByModeName)) {
    const filePath = path.join(THEMES_DIR, `${modeName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`✅ Wrote ${filePath}`);
  }

  console.log("✅ Export complete.");
})();
