import ColorBlocks from "../../storybook/ColorBlocks";
import { customPropertiesArray } from "../../../helpers";

export default {
  component: ColorBlocks,
  argTypes: {},
};

export const Red = {
  args: {},
  render: (args: any) => (
    <div
      style={{
        border: "1px solid var(--colors-grey-400)",
        borderRadius: "var(--radii-md)",
        padding: "var(--spacing-lg)",
      }}
    >
      <ColorBlocks color="red" />
    </div>
  ),
};

// export const Blue = {
//   args: {},
//   render: (args: any) => (
//     <div
//       style={{
//         border: "1px solid var(--colors-grey-400)",
//         borderRadius: "var(--radii-md)",
//         padding: "var(--spacing-lg)",
//       }}
//     >
//       {customPropertiesArray
//         .filter((x) => x.name.includes("colors"))
//         .filter((x) => x.name.includes("blue"))
//         .map((token) => (
//           <ColorBlock
//             color={token.value}
//             tokenName={token.token}
//             name={token.name}
//           />
//         ))}
//     </div>
//   ),
// };
