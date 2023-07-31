import React from "react";
import TokenBlock from "./TokenBlock";
import "@mmhuntsberry/tokens";

export type SizeBlockProps = {
  tokenName: string;
  name: string;
  value?: string;
};

const SizeBlock: React.FC<SizeBlockProps> = ({ tokenName, name, value }) => {
  return (
    <TokenBlock tokenName={tokenName} name={name} value={value} type="size" />
  );
};

export default SizeBlock;
