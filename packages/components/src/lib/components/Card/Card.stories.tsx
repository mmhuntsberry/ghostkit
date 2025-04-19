import { Meta, StoryObj } from "@storybook/react/*";
// import type { ButtonProps } from "./Card";
import Button, { Card } from "./Card";
// import { ArrowRight } from "@phosphor-icons/react";

const meta: Meta<typeof Card> = {
  component: Card,
  title: "Card",
  tags: ["autodocs"],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Card",
  },
};
