// import { within } from "@storybook/testing-library";
// import { expect } from "@storybook/jest";
import { Radio } from "./radio";
import type { RadioProps } from "./radio";

export default {
  component: Radio,
  parameters: {
    docs: {
      source: {
        code: null,
      },
    },
  },
};

export const Primary = {
  args: {
    children: "Button Text",
    "data-testid": "my-test",
  },
};
