// packages/tokens/export-figma-tokens.mjs

import fs from "fs";
import path from "path";
import fetch from "node-fetch";

const FILE_ID = process.env.FILE_ID;
const FIGMA_API_KEY = process.env.FIGMA_API_KEY;
const OUTPUT_DIR = path.resolve("packages/tokens");

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

  // Build a mapping from mode IDs to mode names using the collections.
  const modeIdToName = {};
  for (const collection of variableCollections) {
    if (collection.modes) {
      for (const mode of collection.modes) {
        modeIdToName[mode.id] = mode.name;
      }
    }
  }

  // Create objects to hold primitives and aliases for each mode.
  const primitivesByMode = {};
  const aliasesByMode = {};

  // Iterate over each variable.
  for (const v of variables) {
    // Determine the delimiter for splitting the variable name.
    const delimiter = v.name.includes("/") ? "/" : ".";
    let namePath = v.name.split(delimiter);
    if (namePath.length > 3) {
      namePath = namePath.slice(0, 3);
    }

    // Iterate over all mode IDs present in this variable's values.
    const modeIds = Object.keys(v.valuesByMode || {});
    for (const modeId of modeIds) {
      // Initialize mode objects if needed.
      if (!primitivesByMode[modeId]) primitivesByMode[modeId] = {};
      if (!aliasesByMode[modeId]) aliasesByMode[modeId] = {};

      const value = v.valuesByMode[modeId];
      if (!value) continue;

      if (value.type === "VARIABLE_ALIAS") {
        const referencedName = idToName[value.id];
        if (referencedName) {
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
      } else {
        let resolvedValue = value;
        if (v.resolvedType === "COLOR") {
          resolvedValue = rgbaToHex(value);
        }
        setNestedToken(primitivesByMode[modeId], namePath, resolvedValue);
      }
    }
  }

  // Ensure the output directory exists.
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Write separate output files for each mode.
  for (const modeId of Object.keys(primitivesByMode)) {
    const modeName = modeIdToName[modeId] || modeId;
    fs.writeFileSync(
      path.join(OUTPUT_DIR, `primitives_${modeName}.json`),
      JSON.stringify(primitivesByMode[modeId], null, 2)
    );
  }

  for (const modeId of Object.keys(aliasesByMode)) {
    const modeName = modeIdToName[modeId] || modeId;
    fs.writeFileSync(
      path.join(OUTPUT_DIR, `alias_${modeName}.json`),
      JSON.stringify(aliasesByMode[modeId], null, 2)
    );
  }

  console.log("✅ Design tokens exported for all modes.");
})();
