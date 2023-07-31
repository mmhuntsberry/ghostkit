import React from "react";

import ColorBlock from "./ColorBlock";
import { customPropertiesArray } from "../../helpers";
import "@mmhuntsberry/tokens";

export type ColorBlocksProps = {
  color: string;
};

const ColorBlocks: React.FC<ColorBlocksProps> = async ({ color }) => {
  return await customPropertiesArray
    .filter((x) => x.name.includes("colors"))
    .filter((x) => x.name.includes(color))
    .map((token) => (
      <ColorBlock
        color={token.value}
        tokenName={token.token}
        name={token.name}
      />
    ));
};

export default ColorBlocks;
