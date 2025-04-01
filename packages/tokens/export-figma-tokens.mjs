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
 * Traverse or create nested objects using an array of keys and set the last key to { value: ... }.
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

  // For primitives, we only use the default mode.
  const primitives = {};
  // For alias tokens, group by mode.
  const aliasesByMode = {};

  for (const v of variables) {
    // Determine the delimiter: if "/" is present, use it; otherwise, use "."
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

    // For primitives, only add non-alias values from the default mode.
    if (defaultValue.type !== "VARIABLE_ALIAS") {
      let resolvedValue = defaultValue;
      if (v.resolvedType === "COLOR") {
        resolvedValue = rgbaToHex(defaultValue);
      }
      setNestedToken(primitives, namePath, resolvedValue);
    } else {
      // For alias tokens, iterate over all modes.
      for (const modeId in v.valuesByMode) {
        const aliasValue = v.valuesByMode[modeId];
        if (!aliasValue || aliasValue.type !== "VARIABLE_ALIAS") continue;
        const referencedName = idToName[aliasValue.id];
        if (!referencedName) continue;
        const aliasDelimiter = referencedName.includes("/") ? "/" : ".";
        let aliasNamePath = referencedName.split(aliasDelimiter);
        if (aliasNamePath.length > 3) {
          aliasNamePath = aliasNamePath.slice(0, 3);
        }
        if (!aliasesByMode[modeId]) {
          aliasesByMode[modeId] = {};
        }
        setNestedToken(
          aliasesByMode[modeId],
          namePath,
          `{${aliasNamePath.join(".")}}`
        );
      }
    }
  }

  // Ensure the output directories exist.
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  if (!fs.existsSync(THEMES_DIR)) {
    fs.mkdirSync(THEMES_DIR, { recursive: true });
  }

  // Write primitives (only one mode) to one file.
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "primitives.json"),
    JSON.stringify(primitives, null, 2)
  );

  // Write alias tokens for each mode to separate files in the themes folder.
  for (const modeId in aliasesByMode) {
    // Use the mode name; if not found, fall back to the mode ID.
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
