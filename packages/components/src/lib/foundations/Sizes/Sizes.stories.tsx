import SizeBlock from "../../storybook/SizeBlock";
import { customPropertiesArray } from "../../../helpers";

export default {
  component: SizeBlock,
};

export const Sizes = {
  args: {},
  render: (args: any) => (
    <div
      style={{
        border: "1px solid var(--colors-grey-400)",
        borderRadius: "var(--radii-md)",
        padding: "var(--spacing-lg)",
      }}
    >
      {customPropertiesArray
        .filter((x) => x.name.includes("sizing"))
        .filter((x) => !x.name.includes("base"))
        .map((token) => (
          <SizeBlock
            tokenName={token.token}
            name={token.name}
            value={token.value}
          />
        ))}
    </div>
  ),
};
