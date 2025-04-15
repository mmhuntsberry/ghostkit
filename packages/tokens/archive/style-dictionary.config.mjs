// build.mjs
import StyleDictionary from "style-dictionary";

const customTransforms = [
  {
    name: "custom/fontSize/rem",
    matcher: (token) =>
      token.$type === "number" &&
      token.path.join("/").toLowerCase().includes("font-size"),
    transformer: (token) => `${token.value / 16}rem`,
  },
  {
    name: "custom/letterSpacing/em",
    matcher: (token) =>
      token.$type === "number" &&
      token.path.join("/").toLowerCase().includes("letter-spacing"),
    transformer: (token) => `${token.value}em`,
  },
  {
    name: "custom/lineHeight/px",
    matcher: (token) =>
      token.$type === "number" &&
      token.path.join("/").toLowerCase().includes("line-height"),
    transformer: (token) => `${token.value}px`,
  },
  {
    name: "custom/opacity/decimal",
    matcher: (token) =>
      token.$type === "number" &&
      token.path.join("/").toLowerCase().includes("opacity"),
    transformer: (token) => {
      const val = parseFloat(token.value);
      return val > 1 ? val / 100 : val;
    },
  },
  {
    name: "custom/size/px",
    matcher: (token) => {
      const path = token.path.join("/").toLowerCase();
      return (
        token.$type === "number" &&
        path.includes("size") &&
        !path.includes("font-size") &&
        !path.includes("letter-spacing") &&
        !path.includes("line-height") &&
        !path.includes("opacity")
      );
    },
    transformer: (token) => `${token.value}px`,
  },
];

// Register each one
customTransforms.forEach(({ name, matcher, transformer }) => {
  StyleDictionary.registerTransform({
    name,
    type: "value",
    matcher,
    transformer,
  });
});

// Extend your build
const SD = StyleDictionary.extend({
  source: ["tokens_new/*.json"],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "build/css/",
      transforms: [
        "attribute/cti",
        "name/cti/kebab",
        "color/hex",
        "custom/fontSize/rem",
        "custom/letterSpacing/em",
        "custom/lineHeight/px",
        "custom/opacity/decimal",
        "custom/size/px",
      ],
      files: [
        {
          destination: "variables.css",
          format: "css/variables",
          options: {
            outputReferences: true,
          },
        },
      ],
    },
  },
});

SD.buildAllPlatforms();
