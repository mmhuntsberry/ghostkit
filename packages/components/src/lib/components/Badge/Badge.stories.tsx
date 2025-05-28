import { Meta, StoryFn } from "@storybook/react";
import type { BadgeProps } from "./Badge";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  component: Badge,
  title: "Badge",
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: ["sm", "md", "lg"],
      control: { type: "select" },
    },
    color: {
      options: [
        "primary",
        "neutral-dark",
        "neutral-light",
        "knockout",
        "warning",
        "highlight",
        "danger",
        "success",
      ],
      control: { type: "select" },
    },
    radius: {
      options: ["square", "md", "rounded"],
      control: { type: "select" },
    },
  },
};

export default meta;

const Template: StoryFn<BadgeProps> = (args) => <Badge {...args} />;

export const Default = Template.bind({});
Default.args = {
  size: "md",
  color: "primary",
  radius: "rounded",
  children: "Badge",
};
