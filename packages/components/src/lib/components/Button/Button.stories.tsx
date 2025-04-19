import { Meta, StoryObj } from "@storybook/react/*";
import type { ButtonProps } from "./Button";
import { Button } from "./Button";
// import { ArrowRight } from "@phosphor-icons/react";

const meta: Meta<typeof Button> = {
  component: Button,
  title: "Button",
  tags: ["autodocs"],
  argTypes: {
    background: {
      options: ["solid", "outlined", "transparent"],
      control: { type: "select" },
    },
    size: {
      options: ["md", "lg", "xl"],
      control: { type: "select" },
    },
    variant: {
      options: ["primary", "neutral"],
      control: { type: "select" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    variant: "primary",
    size: "xl",
    background: "solid",
    disabled: false,
    children: "Button",
  },
};
