import ColorBlocks from "../../../components/ColorBlocks";
import TokenTable from "../../../components/TokenTable";

export default {
  // title: "Foundations/Colors",
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
