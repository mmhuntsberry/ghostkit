import { Meta } from "@storybook/web-components";
import { html } from "lit-html";
import "./button"; // Import the component
import { MyButtonProps } from "./button";
import { TemplateResult } from "lit";

// Meta configuration for Storybook
const meta: Meta = {
  component: "my-button",
};
export default meta;

// Define the type of the story
interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

const Template: Story<MyButtonProps> = ({ label, disabled }) => {
  return html`
    <my-button .label="${label}" .disabled="${disabled}"></my-button>
  `;
};

export const Default = Template.bind({});
Default.args = {
  label: "Click me",
  disabled: false,
};
