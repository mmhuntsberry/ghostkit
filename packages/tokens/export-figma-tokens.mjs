// packages/tokens/export-figma-tokens.mjs

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

// Figma Variables API endpoint for local variables
const VARIABLES_URL = `https://api.figma.com/v1/files/${FILE_ID}/variables/local`;

const headers = {
  "X-Figma-Token": FIGMA_API_KEY,
};

/**
 * Convert Figma's RGBA color (0..1) to a hex string.
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
 * Traverse (or create) nested objects from an array of keys
 * and set the last key = { value: ... }.
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

(async () => {
  // 1. Fetch all local variables from Figma
  const res = await fetch(VARIABLES_URL, { headers });
  if (!res.ok) {
    console.error("❌ Failed to fetch variables:", res.statusText);
    process.exit(1);
  }

  const { meta } = await res.json();
  let variables = meta.variables;
  let variableCollections = meta.variableCollections;

  // Convert to arrays if needed
  if (!Array.isArray(variables)) {
    variables = Object.values(variables);
  }
  if (!Array.isArray(variableCollections)) {
    variableCollections = Object.values(variableCollections);
  }

  // Build a map from variable IDs -> variable name
  const idToName = {};
  for (const v of variables) {
    idToName[v.id] = v.name;
  }

  // Create an object for primitives (default mode only)
  const primitives = {};
  // We'll build aliases in a structure keyed by the *friendly mode name*:
  // e.g., { "Alta": { ...tokens }, "Delish": { ...tokens } }
  const aliasesByModeName = {};

  // 2. Iterate over variables to populate primitives & aliases
  for (const v of variables) {
    // Determine the variable collection for this variable
    const collection = variableCollections.find(
      (c) => c.id === v.variableCollectionId
    );
    if (!collection) continue;

    // Delimiter: if name includes "/", split on "/", else split on "."
    const delimiter = v.name.includes("/") ? "/" : ".";
    let namePath = v.name.split(delimiter);
    // Limit depth to 3
    if (namePath.length > 3) {
      namePath = namePath.slice(0, 3);
    }

    // 2A. Handle the default mode for primitives
    const defaultModeId = collection.defaultModeId;
    const defaultValue = v.valuesByMode?.[defaultModeId];
    if (defaultValue && defaultValue.type !== "VARIABLE_ALIAS") {
      // It's a primitive token for default mode
      let resolvedValue = defaultValue;
      if (v.resolvedType === "COLOR") {
        resolvedValue = rgbaToHex(defaultValue);
      }
      setNestedToken(primitives, namePath, resolvedValue);
    }

    // 2B. Handle all modes for alias tokens
    // Each mode in the variable's valuesByMode is a potential alias
    const modeIds = Object.keys(v.valuesByMode || {});
    for (const modeId of modeIds) {
      const val = v.valuesByMode[modeId];
      // We only care if it's an alias
      if (!val || val.type !== "VARIABLE_ALIAS") continue;

      // Find the user-friendly mode name from this variable's collection
      let modeName = modeId; // fallback to ID
      if (collection.modes) {
        const modeObj = collection.modes.find((m) => m.id === modeId);
        if (modeObj && modeObj.name) {
          modeName = modeObj.name; // e.g. "Alta", "Delish", etc.
        }
      }

      // If we haven't created an object for this mode name yet, do so
      if (!aliasesByModeName[modeName]) {
        aliasesByModeName[modeName] = {};
      }

      // Build the alias reference
      const referencedName = idToName[val.id];
      if (!referencedName) continue;
      // Delimiter for the *referenced* variable
      const refDelimiter = referencedName.includes("/") ? "/" : ".";
      let aliasNamePath = referencedName.split(refDelimiter);
      if (aliasNamePath.length > 3) {
        aliasNamePath = aliasNamePath.slice(0, 3);
      }

      setNestedToken(
        aliasesByModeName[modeName],
        namePath,
        `{${aliasNamePath.join(".")}}`
      );
    }
  }

  // 3. Ensure output directories exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  if (!fs.existsSync(THEMES_DIR)) {
    fs.mkdirSync(THEMES_DIR, { recursive: true });
  }

  // 4. Write primitives to a single file in packages/tokens
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "primitives.json"),
    JSON.stringify(primitives, null, 2)
  );

  // 5. Write each mode's alias tokens using the friendly mode name for the file
  for (const modeName of Object.keys(aliasesByModeName)) {
    // e.g., alias_Alta.json, alias_Delish.json, etc.
    fs.writeFileSync(
      path.join(THEMES_DIR, `alias_${modeName}.json`),
      JSON.stringify(aliasesByModeName[modeName], null, 2)
    );
  }

  console.log(
    "✅ Design tokens exported to primitives.json and themes/alias_<friendly-mode-name>.json"
  );
})();
