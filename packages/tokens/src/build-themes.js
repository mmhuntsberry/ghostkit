const StyleDictionary = require("style-dictionary-utils");
const { registerTransforms } = require("@tokens-studio/sd-transforms");
const { promises } = require("fs");

// Register additional transforms as needed
registerTransforms(StyleDictionary, {
  expand: {
    // composition: true,
  },
});

// Common format registration for CSS variables
StyleDictionary.registerFormat({
  name: "custom/cssVariables",
  formatter: function (dictionary, config) {
    const brand = dictionary.options.brand;

    console.log();

    return `
:root, 
:host {
${dictionary.allProperties
  .map((prop) => {
    let customProp = brand ? `${brand}-${prop.name}` : `${prop.name}`;
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
    console.log({ brand });
    config.platforms.css.files.push({
      destination: `brands/${brand}/${themeName.toLowerCase()}.css`,
      format: "custom/cssVariables",
      filter: (token) => {
        return token.filePath.includes(`${brand.toLowerCase()}.json`);
      },
      options: { brand: brand },
    });
  });
}
// function registerThemeFiles(config, themeName, components, tokenSet) {
//   const themeType = themeName.toLowerCase().includes("light")
//     ? "Light"
//     : "Dark";

//   components.forEach((component) => {
//     config.platforms.css.files.push({
//       destination: `themes/${component}/${themeName.toLowerCase()}.css`,
//       format: "custom/cssVariables",
//       filter: (token) =>
//         token.path[0] === component.toLowerCase() &&
//         token.filePath.includes(`tokens/${themeType}.json`),
//     });
//   });
// }

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
            "name/cti/kebab",
            "ts/descriptionToComment",
            "ts/size/px",
            "ts/opacity",
            "ts/size/lineheight",
            "ts/type/fontWeight",
            "ts/resolveMath",
            "ts/size/css/letterspacing",
            "ts/typography/css/shorthand",
            "ts/border/css/shorthand",
            "ts/shadow/css/shorthand",
            "ts/color/css/hexrgba",
            "ts/color/modifiers",
            "name/cti/kebab",
          ],
          buildPath: "../build/css/",
          files: [],
        },
      },
    };

    // Register global files if applicable
    registerGlobalFiles(config, theme.name);

    const brands = [
      "alta",
      // "autoweek",
      // "best-products",
      "bicycling",
      // "biography",
      // "car-and-driver",
      // "cosmopolitan",
      // "country-living",
      // "delish",
      "elle",
      // "elle-decor",
      // "esquire",
      // "good-housekeeping",
      // "harpers-bazaar",
      // "house-beautiful",
      // "mens-health",
      // "oprah-daily",
      // "popular-mechanics",
      // "redbook",
      // "road-and-track",
      "white-label",
    ];
    registerBrandFiles(config, theme.name, brands, theme.selectedTokenSets);

    // Extend, clean, and build with the generated configuration
    const sd = StyleDictionary.extend(config);
    sd.cleanAllPlatforms();
    sd.buildAllPlatforms();
  });
}

run();
