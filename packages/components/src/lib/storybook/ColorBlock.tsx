import React from "react";
import TokenBlock from "./TokenBlock";
import "@mmhuntsberry/tokens";

export type ColorBlockProps = {
  tokenName: string;
  name: string;
};

const ColorBlock: React.FC<ColorBlockProps> = ({ tokenName, name }) => {
  return <TokenBlock tokenName={tokenName} name={name} type="color" />;
};

export default ColorBlock;
