import { Demo as Button } from "./demos/button";
import type { ButtonProps } from "./Button";

export default {
  component: Button,
  parameters: {
    docs: {
      source: {
        code: null,
      },
    },
  },
  argTypes: {
    children: {
      type: {
        required: true,
      },
      control: {
        type: "text",
      },
      description:
        "The 'Children' prop allows for dynamic content customization, supporting text, icons, or a combination of both to create versatile and visually engaging buttons.",
      table: {
        type: { summary: "string | ReactNode" },
        defaultValue: { summary: "Button Text" },
      },
    },
    disabled: {
      control: {
        type: "boolean",
      },
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: false },
      },
      defaultValue: false,
    },
    mode: {
      options: ["light", "dark"],
      control: {
        type: "radio",
      },
      defaultValue: "light",
    },
    size: {
      options: ["sm", "md", "lg"],
      control: {
        type: "radio",
      },
      table: {
        type: { summary: "sm | md | lg" },
        defaultValue: { summary: "md" },
      },
      defaultValue: "md",
    },
    theme: {
      options: ["toolkit", "resin"],
      control: {
        type: "radio",
      },
      defaultValue: "toolkit",
    },
    kind: {
      options: ["primary", "secondary", "text"],
      control: { type: "radio" },
      defaultValue: "primary",
      table: {
        type: { summary: "primary | secondary | text" },
        defaultValue: { summary: "primary" },
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

export const Disabled = {
  render: (args: ButtonProps) => (
    <div className="sb-button-container">
      <Button {...args} data-testid="my-test" />
    </div>
  ),
  args: {
    children: "Button Text",
    disabled: true,
  },
  parameters: {
    controls: {
      disable: true,
    },
  },
};
