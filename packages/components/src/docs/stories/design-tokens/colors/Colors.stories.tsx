import ColorBlocks from "../../../components/ColorBlocks";
import TokenTable from "../../../components/TokenTable";

export default {
  title: "Design Tokens/Colors/Primitive",
  component: ColorBlocks,
  argTypes: {},
  parameters: {
    docs: {
      source: {
        format: true,
        code: null,
      },
    },
  },
};

export const Red = {
  args: {},
  render: (args: any) => (
    <div>
      <TokenTable title="Red">
        <ColorBlocks color="red" />
      </TokenTable>
    </div>
  ),
};

export const Blue = {
  args: {},
  render: (args: any) => (
    <div>
      <TokenTable title="Blue">
        <ColorBlocks color="blue" />
      </TokenTable>
    </div>
  ),
};
