import StyleDictionary from "style-dictionary";

export default {
  source: ["tokens_preprocessed/primitives.json"],
  platforms: {
    css: {
      transformGroup: "css", // built-in web/CSS transforms
      buildPath: "build/css/",
      files: [
        {
          destination: "variables.css",
          format: "css/variables",
          options: { outputReferences: true },
        },
      ],
      resolveReferences: false,
    },
  },
};
