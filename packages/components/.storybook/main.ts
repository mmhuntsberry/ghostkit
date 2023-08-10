import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: [
    "../src/docs/**/*.mdx",
    "../src/docs/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../src/lib/**/*.mdx",
    "../src/lib/**/*.stories.@(js|jsx|ts|tsx|mdx)",
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-coverage",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {
      builder: {
        viteConfigPath: "packages/components/vite.config.ts",
      },
    },
  },
};

export default config;
