import { dirname, join } from "path";
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: [
    "../src/docs/**/*.mdx",
    "../src/docs/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../src/lib/**/*.mdx",
    "../src/lib/**/*.stories.@(js|jsx|ts|tsx|mdx)",
  ],

  addons: [
    getAbsolutePath("storybook-addon-changelog-viewer"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-interactions"),
    {
      name: "@storybook/addon-coverage",
      options: {
        istanbul: {
          onCover: (fileName, fileCoverage) => {
            console.log({ fileName });
            console.log({ fileCoverage });
          },
        },
      },
    },
    getAbsolutePath("@storybook/addon-mdx-gfm"),
  ],

  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {
      builder: {
        viteConfigPath: "packages/components/vite.config.ts",
      },
    },
  },

  docs: {
    autodocs: true,
  },
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
