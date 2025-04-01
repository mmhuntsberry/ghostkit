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
 * Given an array of keys, traverse (or create) nested objects until the last key
 * and set that key to { value: ... }.
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

  // Ensure variables is an array
  let variables = meta.variables;
  if (!Array.isArray(variables)) {
    variables = Object.values(variables);
  }

  // Ensure variableCollections is an array
  let variableCollections = meta.variableCollections;
  if (!Array.isArray(variableCollections)) {
    variableCollections = Object.values(variableCollections);
  }

  // Build a lookup for variable IDs to names.
  const idToName = {};
  for (const v of variables) {
    idToName[v.id] = v.name;
  }

  const primitives = {};
  const aliases = {};

  // Process each variable using the default mode from its collection.
  for (const v of variables) {
    const collection = variableCollections.find(
      (c) => c.id === v.variableCollectionId
    );
    if (!collection) continue;
    const modeId = collection.defaultModeId;
    const value = v.valuesByMode?.[modeId];

    // Force a 3-level structure: [group, subgroup, key]
    let namePath = v.name.split(".");
    if (namePath.length > 3) {
      namePath = namePath.slice(0, 3);
    }

    if (!value) continue;

    if (value.type === "VARIABLE_ALIAS") {
      const referencedName = idToName[value.id];
      if (referencedName) {
        // Force the referenced name into a 3-level structure as well.
        let aliasNamePath = referencedName.split(".");
        if (aliasNamePath.length > 3) {
          aliasNamePath = aliasNamePath.slice(0, 3);
        }
        setNestedToken(aliases, namePath, `{${aliasNamePath.join(".")}}`);
      }
    } else {
      let resolvedValue = value;
      if (v.resolvedType === "COLOR") {
        resolvedValue = rgbaToHex(value);
      }
      setNestedToken(primitives, namePath, resolvedValue);
    }
  }

  // Write output files to packages/tokens/
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "primitives.json"),
    JSON.stringify(primitives, null, 2)
  );
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "alias.json"),
    JSON.stringify(aliases, null, 2)
  );

  console.log("✅ Design tokens exported to primitives.json and alias.json");
})();
