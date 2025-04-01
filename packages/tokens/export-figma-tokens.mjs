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

const headers = {
  "X-Figma-Token": FIGMA_API_KEY,
};

const VARIABLES_URL = `https://api.figma.com/v1/files/${FILE_ID}/variables/local`;

/**
 * Convert Figma RGBA color (with components in [0,1]) to hex string.
 */
function rgbaToHex({ r, g, b, a }) {
  const toHex = (v) =>
    Math.round(v * 255)
      .toString(16)
      .padStart(2, "0");
  const base = `${toHex(r)}${toHex(g)}${toHex(b)}`;
  return a === 1
    ? `#${base.toUpperCase()}`
    : `#${base}${toHex(a).toUpperCase()}`;
}

/**
 * Traverse (or create) nested objects using an array of keys and set the last key to { value: ... }.
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
  const res = await fetch(VARIABLES_URL, { headers });
  if (!res.ok) {
    console.error("❌ Failed to fetch variables:", res.statusText);
    process.exit(1);
  }

  const json = await res.json();
  const { meta } = json;

  // Ensure variables is an array.
  let variables = meta.variables;
  if (!Array.isArray(variables)) {
    variables = Object.values(variables);
  }

  // Ensure variableCollections is an array.
  let variableCollections = meta.variableCollections;
  if (!Array.isArray(variableCollections)) {
    variableCollections = Object.values(variableCollections);
  }

  // Build a mapping from variable IDs to names.
  const idToName = {};
  for (const v of variables) {
    idToName[v.id] = v.name;
  }

  // Build a mapping from mode IDs to mode names using each collection's modes array.
  const modeIdToName = {};
  for (const collection of variableCollections) {
    if (collection.modes) {
      for (const mode of collection.modes) {
        modeIdToName[mode.id] = mode.name;
      }
    }
  }

  // Build primitives using only the default mode.
  const primitives = {};
  for (const v of variables) {
    // Determine the delimiter ("/" if present, otherwise ".")
    const delimiter = v.name.includes("/") ? "/" : ".";
    let namePath = v.name.split(delimiter);
    if (namePath.length > 3) {
      namePath = namePath.slice(0, 3);
    }
    const collection = variableCollections.find(
      (c) => c.id === v.variableCollectionId
    );
    if (!collection) continue;
    const defaultModeId = collection.defaultModeId;
    const defaultValue = v.valuesByMode?.[defaultModeId];
    if (!defaultValue) continue;
    if (defaultValue.type === "VARIABLE_ALIAS") {
      // Skip alias tokens for primitives.
      continue;
    } else {
      let resolvedValue = defaultValue;
      if (v.resolvedType === "COLOR") {
        resolvedValue = rgbaToHex(defaultValue);
      }
      setNestedToken(primitives, namePath, resolvedValue);
    }
  }

  // Collect all mode IDs available in any variable.
  const allModeIds = new Set();
  for (const v of variables) {
    if (v.valuesByMode) {
      Object.keys(v.valuesByMode).forEach((modeId) => allModeIds.add(modeId));
    }
  }

  // For each mode, build an alias object.
  const aliasesByMode = {};
  for (const modeId of allModeIds) {
    aliasesByMode[modeId] = {};
    for (const v of variables) {
      if (!v.valuesByMode) continue;
      const aliasValue = v.valuesByMode[modeId];
      if (!aliasValue || aliasValue.type !== "VARIABLE_ALIAS") continue;
      // Determine the delimiter for the variable name.
      const delimiter = v.name.includes("/") ? "/" : ".";
      let namePath = v.name.split(delimiter);
      if (namePath.length > 3) {
        namePath = namePath.slice(0, 3);
      }
      const referencedName = idToName[aliasValue.id];
      if (!referencedName) continue;
      const aliasDelimiter = referencedName.includes("/") ? "/" : ".";
      let aliasNamePath = referencedName.split(aliasDelimiter);
      if (aliasNamePath.length > 3) {
        aliasNamePath = aliasNamePath.slice(0, 3);
      }
      setNestedToken(
        aliasesByMode[modeId],
        namePath,
        `{${aliasNamePath.join(".")}}`
      );
    }
  }

  // Ensure output directories exist.
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  if (!fs.existsSync(THEMES_DIR)) {
    fs.mkdirSync(THEMES_DIR, { recursive: true });
  }

  // Write primitives to one file.
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "primitives.json"),
    JSON.stringify(primitives, null, 2)
  );

  // Write alias tokens for each mode to separate files in the themes folder.
  for (const modeId of Object.keys(aliasesByMode)) {
    const modeName = modeIdToName[modeId] || modeId;
    fs.writeFileSync(
      path.join(THEMES_DIR, `alias_${modeName}.json`),
      JSON.stringify(aliasesByMode[modeId], null, 2)
    );
  }

  console.log(
    "✅ Design tokens exported to primitives.json and themes/alias_<mode>.json"
  );
})();
