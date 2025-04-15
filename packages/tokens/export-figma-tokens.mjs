/**********************************************************************
 * myScript.mjs
 *
 * One-file script that:
 *   1) Reads variables from Figma (using the local endpoint)
 *   2) Generates nested JSON tokens following a W3C-like design token
 *      structure—with each file named {collectionName}.{modeName}.json.
 *
 * The generated output is written to the "tokens_new" folder.
 **********************************************************************/

import fs from "fs";
import path from "path";
import axios from "axios";
import "dotenv/config";

// --- 0. ENVIRONMENT & SETUP ---
if (!process.env.PERSONAL_ACCESS_TOKEN) {
  throw new Error(
    "PERSONAL_ACCESS_TOKEN env var required (Figma access token)."
  );
}
if (!process.env.FILE_KEY) {
  throw new Error("FILE_KEY env var required (Figma file key).");
}
const PERSONAL_ACCESS_TOKEN = process.env.PERSONAL_ACCESS_TOKEN;
const FILE_KEY = process.env.FILE_KEY;
const BASE_URL = "https://api.figma.com";
const OUTPUT_DIR = path.resolve("tokens_new"); // Output folder for token files

// --- 1. FIGMA API CLASS ---
class FigmaApi {
  constructor(token) {
    this.token = token;
    this.baseUrl = BASE_URL;
  }
  async getLocalVariables(fileKey) {
    const resp = await axios.get(
      `${this.baseUrl}/v1/files/${fileKey}/variables/local`,
      {
        headers: {
          "X-Figma-Token": this.token,
          Accept: "*/*",
        },
      }
    );
    return resp.data;
  }
}

// --- 2. COLOR HELPERS ---
function rgbaToHex({ r, g, b, a }) {
  const toHex = (val) =>
    Math.round(val * 255)
      .toString(16)
      .padStart(2, "0");
  const base = `${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  return a === undefined || a === 1
    ? `#${base}`
    : `#${base}${toHex(a).toUpperCase()}`;
}

// --- 3. TOKEN BUILDING HELPERS ---
function tokenTypeFromResolvedType(resolvedType) {
  switch (resolvedType) {
    case "COLOR":
      return "color";
    case "FLOAT":
      return "number";
    case "STRING":
      return "string";
    case "BOOLEAN":
      return "boolean";
    default:
      return "string";
  }
}

function tokenValueFromVariable(variable, modeId, localVars) {
  const val = variable.valuesByMode[modeId];
  if (typeof val === "object") {
    if ("type" in val && val.type === "VARIABLE_ALIAS") {
      // Wrap the aliased variable name in braces, replacing "/" with "."
      const aliasedVar = localVars[val.id];
      if (!aliasedVar) return "";
      return `{${aliasedVar.name.replace(/\//g, ".")}}`;
    } else if ("r" in val) {
      return rgbaToHex(val);
    } else {
      return val;
    }
  }
  return val;
}

function assignNestedToken(tokensFile, tokenName, token) {
  const parts = tokenName.split("/");
  let current = tokensFile;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]]) current[parts[i]] = {};
    current = current[parts[i]];
  }
  current[parts[parts.length - 1]] = token;
}

/**
 * Builds an object of token files.
 * For each Figma variable (local only) in a collection, create or append
 * to a token file named "{collectionName}.{modeName}.json". The token's location
 * in the JSON is determined by splitting its name on "/".
 */
function tokenFilesFromLocalVariables(localVarsResponse) {
  const tokenFiles = {};
  const collections = localVarsResponse.meta.variableCollections;
  const variables = localVarsResponse.meta.variables;

  Object.values(variables).forEach((variable) => {
    if (variable.remote) return; // skip remote variables
    const collection = collections[variable.variableCollectionId];
    if (!collection) return;
    collection.modes.forEach((mode) => {
      const fileName = `${collection.name}.${mode.name}.json`;
      if (!tokenFiles[fileName]) tokenFiles[fileName] = {};
      const token = {
        $type: tokenTypeFromResolvedType(variable.resolvedType),
        $value: tokenValueFromVariable(variable, mode.modeId, variables),
        $description: variable.description || "",
        $extensions: {
          "com.figma": {
            hiddenFromPublishing: variable.hiddenFromPublishing || false,
            scopes: variable.scopes || [],
            codeSyntax: variable.codeSyntax || {},
          },
        },
      };
      // Use the variable name (split on "/") as the token's path
      assignNestedToken(tokenFiles[fileName], variable.name, token);
    });
  });
  return tokenFiles;
}

// --- 4. WRITE TOKENS FILES ---
function writeTokensFiles(files, outputDir) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  Object.entries(files).forEach(([fileName, tokensFile]) => {
    const filePath = path.join(outputDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(tokensFile, null, 2));
    console.log(`Wrote ${filePath}`);
  });
}

// --- 5. MAIN ---
async function main() {
  try {
    const figmaApi = new FigmaApi(PERSONAL_ACCESS_TOKEN);
    console.log("Fetching local variables from Figma…");
    const localVars = await figmaApi.getLocalVariables(FILE_KEY);
    console.log(
      "Collections found in Figma:",
      Object.values(localVars.meta.variableCollections).map((c) => c.name)
    );

    const tokensFiles = tokenFilesFromLocalVariables(localVars);
    writeTokensFiles(tokensFiles, OUTPUT_DIR);

    console.log("\n✅ Sync from Figma to tokens complete.\n");
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

main();
