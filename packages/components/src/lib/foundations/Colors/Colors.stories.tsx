import ColorBlocks from "../../storybook/ColorBlocks";
import TokenTable from "../../storybook/TokenTable";

export default {
  component: ColorBlocks,
  argTypes: {},
};

export const Red = {
  args: {},
  render: (args: any) => (
    <div className="storyblock">
      <TokenTable>
        <ColorBlocks color="red" />
      </TokenTable>
    </div>
  ),
};

export const Blue = {
  args: {},
  render: (args: any) => (
    <div className="storyblock">
      <TokenTable>
        <ColorBlocks color="blue" />
      </TokenTable>
    </div>
  ),
};
