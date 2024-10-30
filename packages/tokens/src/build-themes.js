const StyleDictionary = require("style-dictionary-utils");
const { registerTransforms } = require("@tokens-studio/sd-transforms");
const { promises } = require("fs");
const _ = require("lodash");

// Register additional transforms as needed
registerTransforms(StyleDictionary, {
  expand: {
    composition: true,
    typography: true,
  },
});

// Register the custom name transform to preserve underscores and remove 'border-radius'
StyleDictionary.registerTransform({
  name: "name/cti/custom",
  type: "name",
  transformer: (prop, options) => {
    return prop.path
      .map((segment) => {
        // Remove 'border-radius' from the final name
        if (segment === "border-radius") {
          return ""; // Skip this segment entirely
        }
        // Preserve underscores in segment names, else use kebab case
        return segment.includes("_") ? segment : _.kebabCase(segment);
      })
      .filter(Boolean) // Filter out empty segments
      .join("-");
  },
});

// Common format registration for CSS variables
StyleDictionary.registerFormat({
  name: "custom/cssVariables",
  formatter: function (dictionary, config) {
    const brand = dictionary.options.brand;

    return `
:root, 
:host {
${dictionary.allProperties
  .map((prop) => {
    let customProp = brand ? `${brand}-${prop.name}` : prop.name;

    // Ensure 'border-radius' is completely removed from the final name
    customProp = customProp.replace("-border-radius", "");

    return `--${customProp}: ${prop.value};`;
  })
  .join("\n")}
}`;
  },
});

// Function to register global files
function registerGlobalFiles(config, themeName) {
  if (themeName.toLowerCase().includes("primitives")) {
    config.platforms.css.files.push({
      destination: `${themeName.toLowerCase()}.css`,
      format: "custom/cssVariables",
      filter: (token) => token.filePath.includes("primitives.json"),
    });
  } else if (themeName.toLowerCase().includes("alias")) {
    config.platforms.css.files.push({
      destination: `${themeName.toLowerCase()}.css`,
      format: "custom/cssVariables",
      filter: (token) => token.filePath.includes("alias.json"),
    });
  }
}

// Function to register CSS files for themes and components
function registerBrandFiles(config, themeName, brands, tokenSet) {
  brands.forEach((brand) => {
    config.platforms.css.files.push({
      destination: `brands/${themeName.toLowerCase()}.css`,
      format: "custom/cssVariables",
      filter: (token) => {
        return token.filePath.includes(`${brand.toLowerCase()}.json`);
      },
      options: { brand: brand },
    });
  });
}

async function run() {
  const $themes = JSON.parse(await promises.readFile("$themes.json", "utf-8"));

  $themes.forEach((theme) => {
    const config = {
      source: Object.entries(theme.selectedTokenSets)
        .filter(([, val]) => val !== "disabled")
        .map(([tokenset]) => `${tokenset}.json`),
      platforms: {
        css: {
          transforms: [
            "name/cti/custom", // Use custom transform
            "ts/descriptionToComment",
            "ts/size/px",
            "ts/opacity",
            "ts/size/lineheight",
            "ts/type/fontWeight",
            "ts/resolveMath",
            "ts/size/css/letterspacing",
            "ts/border/css/shorthand",
            "ts/shadow/css/shorthand",
            "ts/color/css/hexrgba",
            "ts/color/modifiers",
          ],
          buildPath: "../build/css/",
          files: [],
        },
      },
    };

    // Register global files if applicable
    registerGlobalFiles(config, theme.name);

    const brands = ["bicycling", "white-label", "elle"];
    registerBrandFiles(config, theme.name, brands, theme.selectedTokenSets);

    // Extend, clean, and build with the generated configuration
    const sd = StyleDictionary.extend(config);
    sd.cleanAllPlatforms();
    sd.buildAllPlatforms();
  });
}

run();
