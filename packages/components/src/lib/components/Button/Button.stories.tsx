import { Demo as Button } from "./demos/button";
import type { ButtonProps } from "./Button";

export default {
  component: Button,
  parameters: {},
};

export const Primary = {
  render: (args: ButtonProps) => <Button>Label</Button>,
};

export const Disabled = {
  render: (args: ButtonProps) => <Button disabled>Label</Button>,
};
