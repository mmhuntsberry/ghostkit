// config.mjs
/**********************************************************************
 * config.mjs
 *
 * This configuration file reads token JSON files from "tokens_new/*.json"
 * and registers custom transforms:
 *   - For tokens with a path starting with "_font" then "size", it converts
 *     the numeric value (assumed in px) to rem (divide by 16) and appends "rem".
 *   - For tokens with a path starting with "_size", it appends "px" to the
 *     numeric value.
 *   - It also registers a custom naming transform that converts a token’s
 *     path array to a kebab-case name.
 *
 * Run with:
 *   npx style-dictionary build --config config.mjs
 **********************************************************************/
import path from "path";
import StyleDictionary from "style-dictionary";
import { formats, transformGroups } from "style-dictionary/enums";

// CUSTOM NAMING TRANSFORM
const customNamingTransform = {
  name: "custom/name/kebab",
  type: "name",
  matcher: () => true,
  transform: (token) => {
    return Array.isArray(token.path)
      ? token.path.join("-").toLowerCase()
      : token.name?.toLowerCase() || "";
  },
};

// COMBINED CUSTOM SIZE TRANSFORM
// If a token’s type is "number" and:
//   - Its path first element is "_font" and second is "size", then convert the
//     numeric value to rem by dividing by 16.
//   - Its path first element is "_size", then simply append "px".
const customSizeTransform = {
  name: "custom/size/transform",
  type: "value",
  matcher: (token) => {
    const type = token.$type || token.type;
    if (type !== "number") return false;
    if (!Array.isArray(token.path)) return false;
    // Only process tokens whose first token is "_font" or "_size"
    const first = token.path[0].toLowerCase();
    return first === "_font" || first === "_size";
  },
  transform: (token) => {
    const value = token.$value !== undefined ? token.$value : token.value;
    if (!Array.isArray(token.path) || typeof value !== "number") {
      return value;
    }
    const first = token.path[0].toLowerCase();
    if (
      first === "_font" &&
      token.path[1] &&
      token.path[1].toLowerCase() === "size"
    ) {
      // Convert pixel value to rem (assumes base of 16px = 1rem)
      return `${value / 16}rem`;
    } else if (first === "_size") {
      return `${value}px`;
    }
    return value;
  },
};

const customLetterSpacingTransform = {
  name: "custom/letter-spacing/transform",
  type: "value",
  matcher: (token) => {
    const type = token.$type || token.type;
    if (type !== "number") return false;
    if (!Array.isArray(token.path)) return false;
    // Only process tokens whose first token is "_font" or "_size"
    const first = token.path[0].toLowerCase();
    return first === "font";
  },
  transform: (token) => {
    const value = token.$value !== undefined ? token.$value : token.value;
    if (!Array.isArray(token.path) || typeof value !== "number") {
      return value;
    }
    const first = token.path[0].toLowerCase();
    if (
      first === "font" &&
      token.path[1] &&
      token.path[1].toLowerCase() === "letter-spacing"
    ) {
      // Convert pixel value to rem (assumes base of 16px = 1rem)
      return `${value}em`;
    }
    return value;
  },
};

const customLineHeightTransform = {
  name: "custom/line-height/transform",
  type: "value",
  matcher: (token) => {
    const type = token.$type || token.type;
    if (type !== "number") return false;
    if (!Array.isArray(token.path)) return false;
    // Only process tokens whose first token is "_font" or "_size"
    const first = token.path[0].toLowerCase();
    return first === "font";
  },
  transform: (token) => {
    const value = token.$value !== undefined ? token.$value : token.value;
    if (!Array.isArray(token.path) || typeof value !== "number") {
      return value;
    }
    const first = token.path[0].toLowerCase();
    if (
      first === "font" &&
      token.path[1] &&
      token.path[1].toLowerCase() === "line-height"
    ) {
      // Convert pixel value to rem (assumes base of 16px = 1rem)
      return `${value}px`;
    }
    return value;
  },
};

const customOpacityTransform = {
  name: "custom/opacity/decimal",
  type: "value",
  matcher: (token) => {
    const type = getTokenType(token);
    if (type !== "number") return false;
    if (!Array.isArray(token.path)) return false;
    // Match tokens whose path contains the substring "opacity" (case-insensitive)
    return token.path.some((part) => part.toLowerCase().includes("opacity"));
  },
  transform: (token) => {
    const value = token.$value !== undefined ? token.$value : token.value;
    if (typeof value !== "number") return value;
    // If the value is greater than 1 (assumed to be a percentage), divide by 100.
    return value > 1 ? (value / 100).toString() : value.toString();
  },
};
// Register custom transforms
StyleDictionary.registerTransform(customNamingTransform);
StyleDictionary.registerTransform(customSizeTransform);
StyleDictionary.registerTransform(customLetterSpacingTransform);
StyleDictionary.registerTransform(customLineHeightTransform);
StyleDictionary.registerTransform(customOpacityTransform);
// ───────────────────────────────────────────────────────────────
// EXPORT CONFIGURATION
// ───────────────────────────────────────────────────────────────

export default {
  // Include both the primitives and alias files so that references in alias tokens work.
  source: [
    path.resolve("tokens_new/primitives.White Label.json"),
    path.resolve("tokens_new/alias.Prevention.json"),
  ],

  platforms: {
    css: {
      buildPath: "build/css/",
      resolveReferences: false,
      transforms: [
        "attribute/cti", // Adds metadata (category, type, item)
        "color/hsl", // Convert colors to HSL where applicable
        "custom/size/transform",
        "custom/letter-spacing/transform",
        "custom/line-height/transform",
        "custom/opacity/decimal",
        "custom/name/kebab",
      ],
      files: [
        {
          destination: "prevention.css",
          format: formats.cssVariables,
          options: {
            outputReferences: true,
            // resolveReferences: false,
          },
        },
      ],
    },
  },
};
