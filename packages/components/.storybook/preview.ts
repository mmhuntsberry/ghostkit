// .storybook/preview.ts

// Replace your-framework with the framework you are using (e.g., react, vue3)
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
