import cssFileContent from "@mmhuntsberry/tokens?inline";

function parseCssCustomProperties(cssContent: string) {
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

  return customProperties;
}

export const customPropertiesArray = parseCssCustomProperties(cssFileContent);
