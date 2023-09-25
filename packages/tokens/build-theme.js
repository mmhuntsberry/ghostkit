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
  name: "toolkit/typography/css/shorthand",
  type: "value",
  matcher: function (token) {
    if (token.attributes.category === "fontFamilies") {
      console.log(token);
    }

    return token.attributes.category === "fontFamilies";
  },
  transformer: function (token) {
    const fontFamilies = token.original.value;

    return `"${fontFamilies}"`;
  },
});

const sd = StyleDictionary.extend({
  source: ["theme-b.json"],
  platforms: {
    css: {
      transforms: [
        "attribute/cti",
        "ts/descriptionToComment",
        "ts/size/px",
        "ts/opacity",
        "ts/size/lineheight",
        "ts/type/fontWeight",
        "ts/resolveMath",
        "ts/size/css/letterspacing",
        "ts/typography/css/shorthand", // Apply the modified transform here
        "ts/border/css/shorthand",
        "ts/shadow/css/shorthand",
        "ts/color/css/hexrgba",
        "ts/color/modifiers",
        "name/cti/kebab",
        "toolkit/radii/px",
        "toolkit/spacing/px",
        "toolkit/fontSize/px",
        "toolkit/typography/css/shorthand",
      ],
      buildPath: "themes/",
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
