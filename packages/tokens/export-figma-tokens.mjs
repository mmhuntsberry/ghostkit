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
  const [localData, publishedData] = await Promise.all([
    fetchJSON(VARIABLES_LOCAL),
    fetchJSON(VARIABLES_PUBLISHED),
  ]);

  const variables = Array.isArray(localData.meta.variables)
    ? localData.meta.variables
    : Object.values(localData.meta.variables);

  const allCollections = [
    ...(Array.isArray(localData.meta.variableCollections)
      ? localData.meta.variableCollections
      : Object.values(localData.meta.variableCollections)),
    ...(Array.isArray(publishedData.meta.variableCollections)
      ? publishedData.meta.variableCollections
      : Object.values(publishedData.meta.variableCollections)),
  ];

  const idToName = {};
  for (const v of variables) {
    idToName[v.id] = v.name;
  }

  const modeIdToName = {};
  for (const collection of allCollections) {
    for (const mode of collection?.modes || []) {
      if (!modeIdToName[mode.id]) {
        modeIdToName[mode.id] = mode.name;
      }
    }
  }

  const primitives = {};
  const aliasesByModeName = {};

  for (const v of variables) {
    const collection = allCollections.find(
      (c) => c.id === v.variableCollectionId
    );
    if (!collection) continue;

    const delimiter = v.name.includes("/") ? "/" : ".";
    const namePath = v.name.split(delimiter).slice(0, 3);

    const defaultModeId = collection.defaultModeId;
    const defaultValue = v.valuesByMode?.[defaultModeId];
    if (defaultValue && defaultValue.type !== "VARIABLE_ALIAS") {
      const value =
        v.resolvedType === "COLOR" ? rgbaToHex(defaultValue) : defaultValue;
      setNestedToken(primitives, namePath, value);
    }

    for (const [modeId, tokenValue] of Object.entries(v.valuesByMode || {})) {
      if (!tokenValue || tokenValue.type !== "VARIABLE_ALIAS") continue;

      const modeName = modeIdToName[modeId] || modeId;
      const safeName = modeName.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
      if (!aliasesByModeName[safeName]) {
        aliasesByModeName[safeName] = {};
      }

      const referencedName = idToName[tokenValue.id];
      if (!referencedName) continue;

      const refDelimiter = referencedName.includes("/") ? "/" : ".";
      const refPath = referencedName.split(refDelimiter).slice(0, 3);
      setNestedToken(
        aliasesByModeName[safeName],
        namePath,
        `{${refPath.join(".")}}`
      );
    }
  }

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "primitives.json"),
    JSON.stringify(primitives, null, 2)
  );
  console.log("✅ Wrote primitives.json");

  for (const [modeName, data] of Object.entries(aliasesByModeName)) {
    const filePath = path.join(THEMES_DIR, `${modeName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`✅ Wrote ${filePath}`);
  }

  console.log("✅ Export complete.");
})();
