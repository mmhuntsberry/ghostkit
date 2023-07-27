import ColorBlock from "../../storybook/ColorBlock";
import { customPropertiesArray } from "../helpers";

export default {
  component: ColorBlock,

  // excludeStories: /.*Disabled$/,
  argTypes: {},
};

console.log(customPropertiesArray);

/**
 * The Button component is used to trigger an action or event, such as submitting a form, opening a dialog, canceling an action, or performing a delete operation. Buttons communicate actions that users can take.
 */
export const Red = {
  args: {
    color: "Red 50",
    tokenName: "--colors-red-50",
  },
  render: (args: any) => (
    <div
      style={{
        border: "1px solid var(--colors-grey-400)",
        borderRadius: "var(--radii-md)",
        padding: "var(--spacing-lg)",
      }}
    >
      {customPropertiesArray
        .filter((x) => x.name.includes("colors"))
        .filter((x) => x.name.includes("red"))
        .map((token) => (
          <ColorBlock
            color={token.value}
            tokenName={token.token}
            name={token.name}
          />
        ))}
    </div>
  ),
};

export const Blue = {
  args: {
    // color: "Red 50",
    // tokenName: "--colors-red-50",
  },
  render: (args: any) => (
    <div
      style={{
        border: "1px solid var(--colors-grey-400)",
        borderRadius: "var(--radii-md)",
        padding: "var(--spacing-lg)",
      }}
    >
      {customPropertiesArray
        .filter((x) => x.name.includes("colors"))
        .filter((x) => x.name.includes("blue"))
        .map((token) => (
          <ColorBlock
            color={token.value}
            tokenName={token.token}
            name={token.name}
          />
        ))}
    </div>
  ),
};
