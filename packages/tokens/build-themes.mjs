/**********************************************************************
 * config.mjs
 *
 * This configuration file reads token JSON files from "tokens_new/*.json"
 * and registers custom transforms:
 *   - Tokens under _font/size are assumed to be pixel values and are
 *     converted to rem (divide by 16).
 *   - Tokens under font/line-height remain in pixels (appends "px").
 *   - Tokens under font/letter-spacing are suffixed with "em".
 *   - Tokens under _size are suffixed with "px".
 *   - Tokens whose path contains "opacity" are converted to a decimal
 *     (if the number is greater than 1, it’s divided by 100).
 *   - A custom naming transform converts each token’s path array into a
 *     kebab-case token name.
 *
 * Run with:
 *   npx style-dictionary build --config config.mjs
 **********************************************************************/

import StyleDictionary from "style-dictionary";
import { formats } from "style-dictionary/enums";

// Helper: Get token type (using $type if available)
function getTokenType(token) {
  return token.$type || token.type;
}

// CUSTOM NAMING TRANSFORM: Convert token.path array to kebab-case name.
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

// CUSTOM TRANSFORM: _font/size => Convert from px to rem.
const customFontSizeTransform = {
  name: "custom/fontSize/rem",
  type: "value",
  matcher: (token) => {
    if (!Array.isArray(token.path)) return false;
    const first = token.path[0].toLowerCase();
    const second = token.path[1] ? token.path[1].toLowerCase() : "";
    return (
      (first === "_font" || first === "font") &&
      second === "size" &&
      typeof (token.$value !== undefined ? token.$value : token.value) ===
        "number"
    );
  },
  transform: (token) => {
    const value = token.$value !== undefined ? token.$value : token.value;
    return `${value / 16}rem`;
  },
};

// CUSTOM TRANSFORM: font/line-height => Leave value in px.
const customLineHeightTransform = {
  name: "custom/line-height/transform",
  type: "value",
  matcher: (token) => {
    if (!Array.isArray(token.path)) return false;
    const first = token.path[0].toLowerCase();
    const second = token.path[1] ? token.path[1].toLowerCase() : "";
    return (
      (first === "font" || first === "_font") &&
      second === "line-height" &&
      typeof (token.$value !== undefined ? token.$value : token.value) ===
        "number"
    );
  },
  transform: (token) => {
    const value = token.$value !== undefined ? token.$value : token.value;
    return `${value}px`;
  },
};

// CUSTOM TRANSFORM: font/letter-spacing => Append "em".
const customLetterSpacingTransform = {
  name: "custom/letter-spacing/transform",
  type: "value",
  matcher: (token) => {
    if (!Array.isArray(token.path)) return false;
    const first = token.path[0].toLowerCase();
    const second = token.path[1] ? token.path[1].toLowerCase() : "";
    return (
      (first === "font" || first === "_font") &&
      second === "letter-spacing" &&
      typeof (token.$value !== undefined ? token.$value : token.value) ===
        "number"
    );
  },
  transform: (token) => {
    const value = token.$value !== undefined ? token.$value : token.value;
    return `${value}em`;
  },
};

// CUSTOM TRANSFORM: _size => Append "px".
const customSizeTransform = {
  name: "custom/size/transform",
  type: "value",
  matcher: (token) => {
    if (!Array.isArray(token.path)) return false;
    const first = token.path[0].toLowerCase();
    return (
      first === "_size" &&
      typeof (token.$value !== undefined ? token.$value : token.value) ===
        "number"
    );
  },
  transform: (token) => {
    const value = token.$value !== undefined ? token.$value : token.value;
    return `${value}px`;
  },
};

// CUSTOM TRANSFORM: opacity => Convert number to decimal between 0 and 1.
const customOpacityTransform = {
  name: "custom/opacity/decimal",
  type: "value",
  matcher: (token) => {
    if (!Array.isArray(token.path)) return false;
    if (getTokenType(token) !== "number") return false;
    // Check if any part of the token path includes "opacity" (case-insensitive)
    return token.path.some((part) => part.toLowerCase().includes("opacity"));
  },
  transform: (token) => {
    const value = token.$value !== undefined ? token.$value : token.value;
    if (typeof value !== "number") return value;
    // If the value is greater than 1 (assumed to be a percentage), convert it.
    const decimal = value > 1 ? value / 100 : value;
    return decimal.toString();
  },
};

// Register our custom transforms.
StyleDictionary.registerTransform(customNamingTransform);
StyleDictionary.registerTransform(customFontSizeTransform);
StyleDictionary.registerTransform(customLineHeightTransform);
StyleDictionary.registerTransform(customLetterSpacingTransform);
StyleDictionary.registerTransform(customSizeTransform);
StyleDictionary.registerTransform(customOpacityTransform);

// EXPORT CONFIGURATION
export default {
  source: ["tokens_new/*.json"],
  platforms: {
    css: {
      buildPath: "build/css/",
      prefix: "",
      // The order of transforms is important.
      transforms: [
        "attribute/cti", // Adds CTI (category/type/item/subitem) attributes.
        "color/hsl", // Converts color tokens to HSL.
        "custom/opacity/decimal", // Process any tokens with "opacity".
        "custom/fontSize/rem", // Convert _font/size tokens to rem.
        "custom/line-height/transform", // Process font line-heights in px.
        "custom/letter-spacing/transform", // Process letter-spacing tokens to em.
        "custom/size/transform", // Process _size tokens to px.
        "custom/name/kebab", // Re-name tokens using a custom kebab-case transform.
      ],
      files: [
        {
          destination: "variables.css",
          format: formats.cssVariables,
          options: {
            outputReferences: true,
          },
        },
      ],
    },
  },
};
