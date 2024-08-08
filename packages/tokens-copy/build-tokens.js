const { registerTransforms } = require("@tokens-studio/sd-transforms");
const StyleDictionary = require("style-dictionary");

registerTransforms(StyleDictionary, {
  excludeParentKeys: true,
});

StyleDictionary.registerTransform({
  name: "toolkit/radii/px",
  type: "value",
  matcher: function (token) {
    return token.attributes.category === "radii";
  },
  transformer: function (token) {
    return token.original.value + "px";
  },
});

StyleDictionary.registerTransform({
  name: "toolkit/spacing/px",
  type: "value",
  matcher: function (token) {
    return token.attributes.category === "spacing";
  },
  transformer: function (token) {
    return token.original.value + "px";
  },
});

StyleDictionary.registerTransform({
  name: "toolkit/fontSize/px",
  type: "value",
  matcher: function (token) {
    return token.attributes.category === "fontSize";
  },
  transformer: function (token) {
    return token.original.value + "px";
  },
});

StyleDictionary.registerTransform({
  name: "size/rem",
  type: "value",
  matcher: function (token) {
    return (
      token.attributes.category === "sizing" ||
      token.attributes.category === "spacing"
    );
  },
  transformer: function (token) {
    // Define the base font size in pixels (change this to match your design system)
    const baseFontSizePx = 16;

    // Calculate the value in rems
    const valueInRem = token.original.value / baseFontSizePx;

    // Round the value to a reasonable number of decimal places
    const remValue = valueInRem.toFixed(4); // Adjust the number of decimal places as needed

    return `${remValue}rem`;
  },
});

StyleDictionary.registerTransform({
  name: "toolkit/radii/pxToRem",
  type: "value",
  matcher: function (token) {
    return token.attributes.category === "radii";
  },
  transformer: function (token) {
    // Define the base font size in pixels (change this to match your design system)
    const baseFontSizePx = 16;

    // Calculate the value in rems
    const valueInRem = token.original.value / baseFontSizePx;

    // Round the value to a reasonable number of decimal places
    const remValue = valueInRem.toFixed(4); // Adjust the number of decimal places as needed

    return `${remValue}rem`;
  },
});

const sd = StyleDictionary.extend({
  source: ["core.json"],
  platforms: {
    css: {
      transforms: [
        "attribute/cti",
        "ts/descriptionToComment",
        // "ts/size/px",
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
        // "toolkit/radii/px",
        // "toolkit/spacing/px",
        "toolkit/radii/pxToRem",
        "size/rem",
      ],
      buildPath: "build/css/",
      files: [
        {
          destination: "global.css",
          format: "css/variables",
        },
      ],
    },
  },
});

sd.cleanAllPlatforms();
sd.buildAllPlatforms();
