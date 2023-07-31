import { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        method: "",
        order: ["getting-started", "foundations", "components"],
        locales: "",
      },
    },
  },
};

export default preview;
