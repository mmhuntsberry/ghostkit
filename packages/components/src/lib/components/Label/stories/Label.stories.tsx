import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "../Label";

const meta: Meta<typeof Label> = {
  title: "Components/Label",
  component: Label,
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/8a1uyVQh9TYks3b5Z3nlOv/playground-matt?node-id=8497-25363&t=0ZpKQH4Ta1isy0EC-4",
    },
  },
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["xs", "sm"],
    },
    variant: {
      control: { type: "select" },
      options: ["default", "knockout"],
    },
    children: {
      control: { type: "text" },
    },
  },
  args: {
    children: "Label",
    size: "sm",
    variant: "default",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Label",
    size: "sm",
    variant: "default",
  },
};

export const Small: Story = {
  args: {
    children: "Label",
    size: "xs",
    variant: "default",
  },
};

export const Knockout: Story = {
  args: {
    children: "Label",
    size: "sm",
    variant: "knockout",
  },
};

export const SmallKnockout: Story = {
  args: {
    children: "Label",
    size: "xs",
    variant: "knockout",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <Label size="xs" variant="default">
          Small Default
        </Label>
        <Label size="sm" variant="default">
          Medium Default
        </Label>
      </div>
      <div
        style={{
          display: "flex",
          gap: "16px",
          alignItems: "center",
          backgroundColor: "#333",
          padding: "8px",
        }}
      >
        <Label size="xs" variant="knockout">
          Small Knockout
        </Label>
        <Label size="sm" variant="knockout">
          Medium Knockout
        </Label>
      </div>
    </div>
  ),
};
