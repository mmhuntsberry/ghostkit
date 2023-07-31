// import cssFileContent from "@mmhuntsberry/tokens?inline";

// function parseCssCustomProperties(cssContent: string) {
//   const customProperties = [];
//   const regex = /--([\w-]+):\s*(.*?);/g;
//   let match;

//   while ((match = regex.exec(cssContent))) {
//     const [, token, value] = match;
//     const name = token.replace("--", "").replace(/-/g, " ");
//     customProperties.push({
//       name,
//       token,
//       value,
//     });
//   }

//   return customProperties;
// }

export function parseCssCustomProperties(
  cssContent: string
): Promise<{ name: string; token: string; value: string }[]> {
  return new Promise((resolve, reject) => {
    const customProperties = [];
    const regex = /--([\w-]+):\s*(.*?);/g;
    let match;

    while ((match = regex.exec(cssContent))) {
      const [, token, value] = match;
      const name = token.replace("--", "").replace(/-/g, " ");
      customProperties.push({
        name,
        token,
        value,
      });
    }

    resolve(customProperties);
  });
}

// Usage:
// parseCssCustomProperties(cssFileContent).then((customPropertiesArray) => {
//   // Use the customPropertiesArray here
//   console.log(customPropertiesArray);
// });

// export const customPropertiesArray = parseCssCustomProperties(cssFileContent);
