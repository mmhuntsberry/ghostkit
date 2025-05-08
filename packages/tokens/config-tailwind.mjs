/**********************************************************************
 * config-tailwind.mjs
 *
 * Style Dictionary v4 CLI config to generate a single Tailwind
 * tokens file (build/tailwind/tailwind.tokens.js).
 *
 * Usage:
 *   npx style-dictionary build --config config-tailwind.mjs
 **********************************************************************/

import StyleDictionary from "style-dictionary";

// ---------- CUSTOM TRANSFORMS ----------
// Kebab-case names
StyleDictionary.registerTransform({
  name: "custom/name/kebab",
  type: "name",
  matcher: () => true,
  transform: (token) =>
    Array.isArray(token.path)
      ? token.path.join("-").toLowerCase()
      : (token.name || "").toLowerCase(),
});

// Font-size px ➔ rem
StyleDictionary.registerTransform({
  name: "custom/font-size/pxToRem",
  type: "value",
  matcher: (token) =>
    token.attributes?.category === "fontSize" &&
    typeof token.value === "number",
  transform: (token) => `${token.value / 16}rem`,
});

// Size raw px
StyleDictionary.registerTransform({
  name: "custom/size/px",
  type: "value",
  matcher: (token) =>
    token.attributes?.category === "size" && typeof token.value === "number",
  transform: (token) => `${token.value}px`,
});

// Opacity percent ➔ decimal
StyleDictionary.registerTransform({
  name: "custom/opacity/decimal",
  type: "value",
  matcher: (token) => token.attributes?.category === "opacity",
  transform: (token) => {
    const v = token.value;
    return typeof v === "number" && v > 1 ? v / 100 : v;
  },
});

// ---------- TRANSFORM GROUP ----------
StyleDictionary.registerTransformGroup({
  name: "tailwind",
  transforms: [
    "attribute/cti",
    "color/hex",
    "custom/name/kebab",
    "custom/font-size/pxToRem",
    "custom/size/px",
    "custom/opacity/decimal",
  ],
});

// ---------- CUSTOM FORMAT ----------
StyleDictionary.registerFormat({
  name: "tailwind/css-modules",
  format: ({ dictionary }) => {
    const tokens = dictionary.allTokens.reduce((acc, token) => {
      acc[token.name] = token.value;
      return acc;
    }, {});

    // Build JS module exporting theme.extend
    return `module.exports = {
  theme: {
    extend: ${JSON.stringify(tokens, null, 2)}
  }
};`;
  },
});

// ---------- EXPORT CONFIG ----------
export default {
  source: ["tokens_new/primitives.White Label.json"],
  platforms: {
    tailwind: {
      transformGroup: "tailwind",
      buildPath: "build/tailwind/",
      files: [
        {
          destination: "tailwind.tokens.js",
          format: "tailwind/css-modules",
        },
      ],
    },
  },
};
