// packages/tokens/export-figma-tokens.js

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

  const { meta } = await res.json();
  const { variables, variableCollections } = meta;

  const idToName = {};
  const idToVariable = {};

  for (const v of variables) {
    idToName[v.id] = v.name;
    idToVariable[v.id] = v;
  }

  const primitives = {};
  const aliases = {};

  for (const v of variables) {
    const collection = variableCollections.find(
      (c) => c.id === v.variableCollectionId
    );
    const modeId = collection.defaultModeId;
    const value = v.valuesByMode?.[modeId];
    const namePath = v.name.split(".");

    if (!value) continue;

    if (value.type === "VARIABLE_ALIAS") {
      const referencedName = idToName[value.id];
      if (referencedName) {
        setNestedToken(aliases, namePath, `{${referencedName}}`);
      }
    } else {
      let resolvedValue = value;

      if (v.resolvedType === "COLOR") {
        resolvedValue = rgbaToHex(value);
      }

      setNestedToken(primitives, namePath, resolvedValue);
    }
  }

  // Write output files
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

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
