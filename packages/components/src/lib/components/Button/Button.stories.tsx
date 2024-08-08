<<<<<<< HEAD
<<<<<<< HEAD
=======
import { within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
>>>>>>> 059c679 (update core)
=======
>>>>>>> a74080c (update core)
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> a74080c (update core)

  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);

    const button = canvas.getByTestId("my-test");
    expect(button instanceof HTMLButtonElement).toBe(true);
  },
};

export const Kinds = {
  render: (args: ButtonProps) => (
    <div className="sb-button-container">
      <Button {...args} onClick={args.onClick} />
      <Button {...args} kind="secondary" />
      <Button {...args} kind="text" />
    </div>
  ),
  args: {
    children: "Button Text",
    kind: "primary",
    onClick: () => console.log("Hello"),
  },

  parameters: {
    controls: {
      disable: true, // This throws a warning in the terminal because we are turning off controls
    },
  },
<<<<<<< HEAD
>>>>>>> b8deeba (chore: adjust documentation styles)
=======
=======
>>>>>>> d92c5db (cleanup: stories)
>>>>>>> a74080c (update core)
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
    kind: "primary",
=======
>>>>>>> 3578155 (update core)
  },
  parameters: {
    controls: {
      disable: true,
    },
  },
<<<<<<< HEAD
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);

    const button = canvas.getByTestId("my-test");
    const buttonStyle = window.getComputedStyle(button);

    expect(buttonStyle.cursor).toBe("not-allowed");
  },
};

export const LightMode = {
  render: (args: ButtonProps) => (
    <div className="sb-button-container">
      <Button {...args} />
      <Button {...args} kind="secondary" />
      <Button {...args} kind="text" />
    </div>
  ),
  args: {
    children: "Button Text",
    kind: "primary",
    mode: "light",
>>>>>>> b8deeba (chore: adjust documentation styles)
  },
  parameters: {
    controls: {
      disable: true,
    },
  },
};
<<<<<<< HEAD
=======

export const DarkMode = {
  render: (args: ButtonProps) => (
    <div className="sb-button-container">
      <Button {...args} />
      <Button {...args} kind="secondary" />
      <Button {...args} kind="text" />
    </div>
  ),
  args: {
    children: "Button Text",
    kind: "primary",
    mode: "dark",
  },
  parameters: {
    backgrounds: {
      default: "dark",
    },
    controls: {
      disable: true,
    },
  },
=======
>>>>>>> d92c5db (cleanup: stories)
};
>>>>>>> a74080c (update core)
