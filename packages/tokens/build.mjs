// build-themes.mjs
import StyleDictionary from "style-dictionary";

StyleDictionary.extend("config.mjs");

import { transforms, transformTypes } from "style-dictionary/enums";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Setup __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CONSTANTS
const TOKENS_DIR = path.resolve(__dirname, "tokens_new");
const BUILD_DIR = path.resolve(__dirname, "build/css");

// Ensure the build directory exists
if (!fs.existsSync(BUILD_DIR)) {
  fs.mkdirSync(BUILD_DIR, { recursive: true });
}

// Helper: Get token type (using $type if available)
const getTokenType = (token) => token.$type || token.type;

// -------------------------------------------------------------------
// CUSTOM TRANSFORMS
// -------------------------------------------------------------------

// 1. Naming Transform: Generate a kebab-case token name from token.path.
const customNamingTransform = {
  name: "custom/name/kebab",
  type: "name",
  matcher: () => true,
  transform: (token) =>
    Array.isArray(token.path)
      ? token.path.join("-").toLowerCase()
      : token.name
      ? token.name.toLowerCase()
      : "",
};
StyleDictionary.registerTransform(customNamingTransform);

// 2. Combined Size Transform:
//    • For tokens under "_font/size": convert pixels to rem (divide by 16)
//    • For tokens under "_size": append "px"
const customSizeTransform = {
  name: "custom/size/transform",
  type: "value",
  matcher: (token) => {
    const type = getTokenType(token);
    if (type !== "number") return false;
    if (!Array.isArray(token.path)) return false;
    const first = token.path[0].toLowerCase();
    return first === "_font" || first === "_size";
  },
  transform: (token) => {
    // Use token.$value if defined; otherwise, use token.value.
    const value = token.$value !== undefined ? token.$value : token.value;
    if (!Array.isArray(token.path) || typeof value !== "number") return value;
    const first = token.path[0].toLowerCase();
    if (first === "_font" && token.path[1]) {
      const second = token.path[1].toLowerCase();
      if (second === "size") {
        return `${value / 16}rem`;
      }
    } else if (first === "_size") {
      return `${value}px`;
    }
    return String(value);
  },
};
StyleDictionary.registerTransform(customSizeTransform);

// 3. Letter-Spacing Transform:
//    For tokens under "font/letter-spacing", append "em".
const customLetterSpacingTransform = {
  name: "custom/letter-spacing/transform",
  type: "value",
  matcher: (token) => {
    const type = getTokenType(token);
    if (type !== "number") return false;
    if (!Array.isArray(token.path)) return false;
    return (
      token.path[0].toLowerCase() === "font" &&
      token.path[1] &&
      token.path[1].toLowerCase() === "letter-spacing"
    );
  },
  transform: (token) => {
    const value = token.$value !== undefined ? token.$value : token.value;
    return typeof value === "number" ? `${value}em` : value;
  },
};
StyleDictionary.registerTransform(customLetterSpacingTransform);

// 4. Line-Height Transform:
//    For tokens under "font/line-height", append "px".
const customLineHeightTransform = {
  name: "custom/line-height/transform",
  type: "value",
  matcher: (token) => {
    const type = getTokenType(token);
    if (type !== "number") return false;
    if (!Array.isArray(token.path)) return false;
    return (
      token.path[0].toLowerCase() === "font" &&
      token.path[1] &&
      token.path[1].toLowerCase() === "line-height"
    );
  },
  transform: (token) => {
    const value = token.$value !== undefined ? token.$value : token.value;
    return `${value}px`;
  },
};
StyleDictionary.registerTransform(customLineHeightTransform);

// 5. Opacity Transform:
//    For tokens whose path includes "opacity", convert numeric value to a decimal (0–1).
//    If the value is greater than 1, assume it is a percentage and divide by 100.
const customOpacityTransform = {
  name: "custom/opacity/decimal",
  type: "value",
  matcher: (token) => {
    const type = getTokenType(token);
    if (type !== "number") return false;
    if (!Array.isArray(token.path)) return false;
    return token.path.some((p) => p.toLowerCase().includes("opacity"));
  },
  transform: (token) => {
    const value = token.$value !== undefined ? token.$value : token.value;
    if (typeof value !== "number") return value;
    return value > 1 ? (value / 100).toString() : value.toString();
  },
};
StyleDictionary.registerTransform(customOpacityTransform);

// -------------------------------------------------------------------
// PER‑THEME BUILD
// -------------------------------------------------------------------

// Get a list of all JSON theme files in the tokens directory.
const tokenFiles = fs
  .readdirSync(TOKENS_DIR)
  .filter((fileName) => fileName.endsWith(".json"));

for (const fileName of tokenFiles) {
  const themeName = fileName.replace(/\.json$/, "");
  const filePath = path.join(TOKENS_DIR, fileName);
  console.log(`▶ Building theme: ${themeName}`);

  // Create a configuration for this theme.
  const themeConfig = {
    source: [filePath],
    platforms: {
      css: {
        buildPath: path.join(BUILD_DIR, "/"),
        prefix: "",
        transforms: [
          "attribute/cti", // Built-in: adds CTI metadata
          "color/hsl", // Built-in: converts color tokens to HSL
          "custom/size/transform",
          "custom/letter-spacing/transform",
          "custom/line-height/transform",
          "custom/opacity/decimal",
          "custom/name/kebab",
        ],
        files: [
          {
            destination: `${themeName}.css`,
            format: "css/variables",
            options: { outputReferences: true },
          },
        ],
      },
    },
  };

  // Extend Style Dictionary with this theme configuration.
  const SD = StyleDictionary.extend(themeConfig);
  try {
    SD.buildAllPlatforms();
    console.log(`✔ Built: ${path.join(BUILD_DIR, `${themeName}.css`)}`);
  } catch (err) {
    console.error(`✖ Error building theme ${themeName}: ${err.message}`);
  }
}

console.log("✅ All themes built successfully.");
