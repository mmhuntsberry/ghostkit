import ColorBlock from "../../storybook/ColorBlock";
import cssFileContent from "@mmhuntsberry/tokens?inline";
import { parseCssCustomProperties } from "../../../helpers";

export default {
  component: ColorBlock,
  render: (args: any, { loaded: { tokens, color } }) => (
    <div
      style={{
        border: "1px solid var(--colors-grey-400)",
        borderRadius: "var(--radii-md)",
        padding: "var(--spacing-lg)",
      }}
    >
      {tokens
        .filter((x) => x.name.includes("colors"))
        .filter((x) => x.name.includes(color))
        .map((token) => (
          <ColorBlock
            key={token.value}
            color={token.value}
            tokenName={token.token}
            name={token.name}
          />
        ))}
    </div>
  ),
  argTypes: {},
};

export const Red = {
  args: {},
  loaders: [
    async () => ({
      tokens: await parseCssCustomProperties(cssFileContent),
      color: "red",
    }),
  ],
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
