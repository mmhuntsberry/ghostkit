import StyleDictionary from "style-dictionary";

const isAliasToken = (filePath) => filePath.includes("alias");

// 1) Register custom format
StyleDictionary.registerFormat({
  name: "custom/custom-variable",
  format: function ({ dictionary, platform }) {
    console.log("All tokens =>", dictionary.allTokens); // debug

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

// 2) Export config
export default {
  // Important: includes all subfolders in src/
  source: ["src/**/*.json"],
  platforms: {
    css: {
      prefix: "ds",
      transformGroup: "css",
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
