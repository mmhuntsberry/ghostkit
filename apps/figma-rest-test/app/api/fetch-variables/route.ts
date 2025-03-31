// app/api/figma-css/route.js

import { NextResponse } from "next/server";
import dotenv from "dotenv";

dotenv.config();

/**
 * Convert a token value to a CSS value.
 * If it’s a color object (with r, g, b, a) convert it to rgba().
 */
function tokenValueToCSS(value) {
  if (
    value &&
    typeof value === "object" &&
    "r" in value &&
    "g" in value &&
    "b" in value &&
    "a" in value
  ) {
    const r = Math.round(value.r * 255);
    const g = Math.round(value.g * 255);
    const b = Math.round(value.b * 255);
    const a = value.a;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  return String(value);
}

/**
 * Convert a token name to a valid CSS variable name.
 * Example: "Neutral color/Neutral Alpha/2" => "neutral-color-neutral-alpha-2"
 */
function toCssVariableName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET(request) {
  // Use your environment variables.
  const FIGMA_API_KEY = process.env.FIGMA_API_KEY;
  const FILE_ID = process.env.FILE_ID;
  const defaultMode = process.env.FIGMA_DEFAULT_MODE || "255:45";

  if (!FIGMA_API_KEY || !FILE_ID) {
    return NextResponse.json(
      { error: "FIGMA_API_KEY and FILE_ID must be set in your environment." },
      { status: 500 }
    );
  }

  // Fetch all variables from Figma's API.
  const url = `https://api.figma.com/v1/files/${FILE_ID}/variables/local`;
  console.log("Fetching Figma tokens from:", url);

  const response = await fetch(url, {
    headers: {
      "X-Figma-Token": FIGMA_API_KEY,
    },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to fetch Figma tokens" },
      { status: response.status }
    );
  }

  const figmaData = await response.json();
  // Uncomment this to inspect the raw response:
  // console.log("Figma data:", JSON.stringify(figmaData, null, 2));

  // Process the tokens.
  const tokens = {};
  const variables = figmaData.meta?.variables || {};

  for (const tokenId in variables) {
    const variable = variables[tokenId];
    let modeKey = defaultMode;
    if (!variable.valuesByMode[defaultMode]) {
      // Fallback: use the first available mode.
      const availableModes = Object.keys(variable.valuesByMode);
      if (availableModes.length > 0) {
        modeKey = availableModes[0];
      } else {
        continue;
      }
    }
    let tokenValue = variable.valuesByMode[modeKey];

    // Resolve aliases if necessary.
    if (
      tokenValue &&
      typeof tokenValue === "object" &&
      tokenValue.type === "VARIABLE_ALIAS"
    ) {
      const aliasId = tokenValue.id;
      const aliasVariable = variables[aliasId];
      if (aliasVariable && aliasVariable.valuesByMode[modeKey]) {
        tokenValue = aliasVariable.valuesByMode[modeKey];
      } else {
        tokenValue = null;
      }
    }

    if (tokenValue !== undefined && tokenValue !== null) {
      tokens[variable.name] = tokenValue;
    }
  }

  // Convert tokens into CSS variables.
  let css = ":root {\n";
  for (const key in tokens) {
    const cssVarName = toCssVariableName(key);
    const cssValue = tokenValueToCSS(tokens[key]);
    css += `  --${cssVarName}: ${cssValue};\n`;
  }
  css += "}\n";

  // Return CSS with a proper Content-Type.
  return NextResponse.json(css, {
    headers: { "Content-Type": "text/css" },
  });
}
