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

const VARIABLES_URL = `https://api.figma.com/v1/files/${FILE_ID}/variables/local`;

const headers = {
  "X-Figma-Token": FIGMA_API_KEY,
};

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
  let variables = Array.isArray(meta.variables)
    ? meta.variables
    : Object.values(meta.variables);
  let variableCollections = Array.isArray(meta.variableCollections)
    ? meta.variableCollections
    : Object.values(meta.variableCollections);

  const idToName = {};
  for (const v of variables) {
    idToName[v.id] = v.name;
  }

  // Create a complete map of modeId => friendlyName across all collections
  const modeIdToName = {};
  for (const collection of variableCollections) {
    for (const mode of collection?.modes || []) {
      modeIdToName[mode.id] = mode.name;
    }
  }

  const primitives = {};
  const aliasesByModeName = {};

  for (const v of variables) {
    const collection = variableCollections.find(
      (c) => c.id === v.variableCollectionId
    );
    if (!collection) continue;

    const delimiter = v.name.includes("/") ? "/" : ".";
    const namePath = v.name.split(delimiter).slice(0, 3);

    // Handle default mode primitive
    const defaultModeId = collection.defaultModeId;
    const defaultValue = v.valuesByMode?.[defaultModeId];

    if (defaultValue && defaultValue.type !== "VARIABLE_ALIAS") {
      const value =
        v.resolvedType === "COLOR" ? rgbaToHex(defaultValue) : defaultValue;
      setNestedToken(primitives, namePath, value);
    }

    // Handle aliases across all modes
    for (const [modeId, val] of Object.entries(v.valuesByMode || {})) {
      if (!val || val.type !== "VARIABLE_ALIAS") continue;

      const modeName = modeIdToName[modeId] || modeId;
      if (!aliasesByModeName[modeName]) {
        aliasesByModeName[modeName] = {};
      }

      const referencedName = idToName[val.id];
      if (!referencedName) continue;

      const refPath = referencedName
        .split(referencedName.includes("/") ? "/" : ".")
        .slice(0, 3);
      setNestedToken(
        aliasesByModeName[modeName],
        namePath,
        `{${refPath.join(".")}}`
      );
    }
  }

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  if (!fs.existsSync(THEMES_DIR)) fs.mkdirSync(THEMES_DIR, { recursive: true });

  // Write primitives
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "primitives.json"),
    JSON.stringify(primitives, null, 2)
  );

  // Write aliases per mode using friendly names
  for (const [modeName, aliasData] of Object.entries(aliasesByModeName)) {
    fs.writeFileSync(
      path.join(THEMES_DIR, `alias_${modeName}.json`),
      JSON.stringify(aliasData, null, 2)
    );
  }

  console.log("✅ Exported:");
  console.log("• primitives.json");
  Object.keys(aliasesByModeName).forEach((mode) => {
    console.log(`• themes/alias_${mode}.json`);
  });
})();
