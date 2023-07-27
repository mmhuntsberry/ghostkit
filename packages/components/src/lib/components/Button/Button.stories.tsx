import Button from "./Button";
import type { ButtonProps } from "./Button";

export default {
  component: Button,
  // excludeStories: /.*Disabled$/,
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
      options: ["toolkit", "dark"],
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

/**
 *
 */
export const Primary = {
  args: {
    children: "Button Text",
  },
};

export const Kinds = {
  render: (args: ButtonProps) => (
    <div style={{ display: "flex", gap: "var(--spacing-xl)" }}>
      <Button {...args} />
      <Button {...args} kind="secondary" />
      <Button {...args} kind="text" />
    </div>
  ),
  args: {
    children: "Button Text",
    kind: "primary",
  },

  parameters: {
    controls: {
      disable: true,
    },
  },
};

export const Disabled = {
  render: (args: ButtonProps) => (
    <div style={{ display: "flex", gap: "var(--spacing-xl)" }}>
      <Button {...args} />
      <Button {...args} kind="secondary" />
      <Button {...args} kind="text" />
    </div>
  ),
  args: {
    children: "Button Text",
    disabled: true,
    kind: "primary",
  },
  parameters: {
    controls: {
      disable: true,
    },
  },
};
