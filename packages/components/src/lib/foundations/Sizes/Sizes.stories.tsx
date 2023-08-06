import TokenTable from "../../storybook/TokenTable";
import SizeBlocks from "../../storybook/SizeBlocks";

export default {
  component: SizeBlocks,
};

export const Sizes = {
  args: {},
  render: (args: any) => (
    <div className="storyblock">
      <TokenTable>
        <SizeBlocks />
      </TokenTable>
    </div>
  ),
};
