import { dirname, join } from "path";
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: [
    "../src/docs/stories/**/*.mdx",
    "../src/docs/stories/**/*.@(mdx|stories.@(js|jsx|ts|tsx))",
    "../src/lib/**/*.mdx",
    "../src/lib/**/*.@(mdx|stories.@(js|jsx|ts|tsx))",
  ],

  addons: [
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-interactions"),
    getAbsolutePath("@storybook/addon-coverage"),
    getAbsolutePath("@storybook/addon-mdx-gfm"),
    "@chromatic-com/storybook",
  ],

  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {
      builder: {
        viteConfigPath: "packages/components/vite.config.ts",
      },
    },
  },

  docs: {},

  staticDirs: [
    // The left side is your local path; the right side (if using an object) is the public URL
    { from: "../../tokens/build", to: "/build" },
  ],

  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
