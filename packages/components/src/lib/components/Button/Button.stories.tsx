import { Demo as Button } from "./demos/Button";
import type { ButtonProps } from "./Button";
import { ArrowRight } from "@phosphor-icons/react";

export default {
  component: Button,
  parameters: {},
};

export const Primary = {
  render: (args: ButtonProps) => <Button>Label</Button>,
};

export const IconRight = {
  render: (args: ButtonProps) => (
    <Button>
      Label <ArrowRight size={24} />
    </Button>
  ),
};

export const Disabled = {
  render: (args: ButtonProps) => <Button disabled>Label</Button>,
};
