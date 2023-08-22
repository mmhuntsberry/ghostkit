import TokenTable from "../../../components/TokenTable";
import SizeBlocks from "../../../components/SizeBlocks";

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
