import { dirname, join } from "path";
import type { StorybookConfig } from "@storybook/web-components-vite";

const config: StorybookConfig = {
  stories: ["../src/lib/**/*.@(mdx|stories.@(js|jsx|ts|tsx))"],
  addons: [
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-interactions"),
    "@chromatic-com/storybook"
  ],

  framework: {
    name: getAbsolutePath("@storybook/web-components-vite"),
    options: {
      builder: {
        viteConfigPath: "packages/web/vite.config.ts",
      },
    },
  },

  docs: {}
};

export default config;

// To customize your Vite configuration you can use the viteFinal field.
// Check https://storybook.js.org/docs/react/builders/vite#configuration
// and https://nx.dev/recipes/storybook/custom-builder-configs

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
