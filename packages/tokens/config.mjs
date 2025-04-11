import StyleDictionary from "style-dictionary";

const isAliasToken = (filePath) => filePath.includes("alias");

// ✅ Match tokens at path root === "size"
StyleDictionary.registerTransform({
  name: "value/size/px",
  type: "value",

  filter: (token) => {
    console.log("token path", token.path[0]);

    return token.path[0] === "size";
  },
  transform: (token) => `${token.value}px`,
});

StyleDictionary.registerTransform({
  name: "value/font-size/rem",
  type: "value",
  filter: (token) => token.path[0] === "font" && token.path[1] === "size",
  transform: (token) => `${parseFloat(token.value) / 16}rem`,
});

StyleDictionary.registerTransform({
  name: "name/cti/kebab",
  type: "name",
  transform: (token) => token.path.join("-"),
});

StyleDictionary.registerFormat({
  name: "custom/custom-variable",
  format: function ({ dictionary, platform }) {
    return `
:root,
:host {
${dictionary.allTokens
  .map((token) => {
    const tokenName = token.name.replace(`${platform.prefix}-`, "");
    if (isAliasToken(token.filePath)) {
      return `--${platform.prefix}-theme-${tokenName}: ${token.value};`;
    }
    return `--${platform.prefix}-${tokenName}: ${token.value};`;
  })
  .join("\n")}
}
`;
  },
});

export default {
  source: ["alias.json", "primtives.json"],
  // source: ["src/**/*.json"],
  platforms: {
    css: {
      prefix: "ds",
      // transformGroup: "css",
      transforms: [
        "attribute/cti",
        "name/cti/kebab",
        "value/size/px",
        "value/font-size/rem",
      ],
      buildPath: "./build/css/",
      files: [
        {
          destination: "index.css",
          format: "custom/custom-variable",
        },
      ],
    },
  },
};
