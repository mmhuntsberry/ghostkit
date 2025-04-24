import { Meta, StoryFn } from "@storybook/react";
import { useGlobals } from "@storybook/preview-api"; // ✅ correct

import type { ButtonProps } from "./Button";
import { Button } from "./Button";

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

const Template: StoryFn<ButtonProps> = (args) => {
  const g = useGlobals();

  switch (g[0].brand) {
    case "delish":
      return <Button {...args} radius="square" />;
    default:
      return <Button {...args} radius="rounded" />;
  }
};

export const Default = Template.bind({});
Default.args = {
  variant: "primary",
  size: "xl",
  background: "solid",
  disabled: false,
  children: "Button",
};
