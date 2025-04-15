// build-tokens.js
const StyleDictionary = require("style-dictionary").extend; // Notice we grab the extend function
const sdRegister = require("style-dictionary");
const fs = require("fs");
const path = require("path");

// ------------------------------------------------------------------
// 1. Register custom transforms, transform groups, and formats
// ------------------------------------------------------------------

// Register a transform to add an attribute based on the top-level key.
// This will add an attribute "category" (stripping any leading underscore) and the token $type.
sdRegister.registerTransform({
  name: "attribute/token-type",
  type: "attribute",
  matcher: function () {
    return true;
  },
  transform: function (token) {
    // token.path is an array, e.g. ["_font", "size", "1"]
    const topLevel = token.path && token.path[0] ? token.path[0] : "";
    return {
      category: topLevel.replace(/^_/, ""), // e.g. "_font" becomes "font"
      type: token.$type,
    };
  },
});

// Transform for size tokens (tokens under _size): append "px" to their value.
sdRegister.registerTransform({
  name: "value/size/px",
  type: "value",
  matcher: function (token) {
    return token.attributes && token.attributes.category === "size";
  },
  transform: function (token) {
    return token.value + "px";
  },
});

// Transform for font-size tokens (under _font/size): convert number to rem.
sdRegister.registerTransform({
  name: "value/font-size/rem",
  type: "value",
  matcher: function (token) {
    return (
      token.attributes &&
      token.attributes.category === "font" &&
      token.path[1] === "size" &&
      token.$type === "number"
    );
  },
  transform: function (token) {
    const numericValue = parseFloat(token.value);
    return numericValue / 16 + "rem";
  },
});

// Transform for color tokens: pass through the raw color value (assumed valid CSS hex).
sdRegister.registerTransform({
  name: "value/color/css",
  type: "value",
  matcher: function (token) {
    return token.$type === "color";
  },
  transform: function (token) {
    return token.value;
  },
});

// Name transform to join the token path with hyphens (and remove leading underscore).
sdRegister.registerTransform({
  name: "name/cti/kebab",
  type: "name",
  transform: function (token) {
    return token.path.join("-").replace(/^_/, "");
  },
});

// Combine transforms into a custom transform group.
sdRegister.registerTransformGroup({
  name: "custom/css",
  transforms: [
    "attribute/token-type",
    "name/cti/kebab",
    "value/size/px",
    "value/font-size/rem",
    "value/color/css",
  ],
});

// Register a custom format that outputs CSS Custom Properties in a :root rule.
sdRegister.registerFormat({
  name: "custom/css-variables",
  format: function ({ dictionary }) {
    return (
      `:root {\n` +
      dictionary.allTokens
        .map((token) => `  --ds-${token.name}: ${token.value};`)
        .join("\n") +
      `\n}`
    );
  },
});

// ------------------------------------------------------------------
// 2. Process each JSON token file individually and output a CSS file
// ------------------------------------------------------------------

const TOKENS_DIR = path.resolve("tokens");
const BUILD_DIR = path.resolve("build/css");

// Create the build directory if it doesn't exist.
if (!fs.existsSync(BUILD_DIR)) {
  fs.mkdirSync(BUILD_DIR, { recursive: true });
}

// Read all JSON files from the tokens folder.
const tokenFiles = fs
  .readdirSync(TOKENS_DIR)
  .filter((fileName) => fileName.endsWith(".json"));

// Loop over each token file.
tokenFiles.forEach((fileName) => {
  const filePath = path.join(TOKENS_DIR, fileName);
  console.log(`Building CSS for ${fileName}...`);

  // Create a new instance of Style Dictionary for this file.
  // Here we use StyleDictionary.extend(config) from the require call.
  const SD = StyleDictionary({
    source: [filePath],
    platforms: {
      css: {
        transformGroup: "custom/css",
        buildPath: BUILD_DIR + path.sep,
        files: [
          {
            destination: fileName.replace(".json", ".css"),
            format: "custom/css-variables",
          },
        ],
      },
    },
  });

  // Build CSS for this token file.
  SD.buildAllPlatforms();
});

console.log("✅ All CSS files built.");
