import React from "react";
import SizeBlock from "./SizeBlock";

export type SizeBlocksProps = {
  base?: number;
};

const SizeBlocks: React.FC<SizeBlocksProps> = ({ base = 4 }) => {
  return (
    <>
      <SizeBlock
        value={`${base * 4}px`}
        tokenName={`sizing-xxs`}
        name="Sizing XXS"
      />
      <SizeBlock
        value={`${base * 6}px`}
        tokenName={`sizing-xs`}
        name="Sizing XS"
      />
      <SizeBlock
        value={`${base * 8}px`}
        tokenName={`sizing-sm`}
        name="Sizing SM"
      />
      <SizeBlock
        value={`${base * 10}px`}
        tokenName={`sizing-md`}
        name="Sizing Md"
      />
      <SizeBlock
        value={`${base * 12}px`}
        tokenName={`sizing-lg`}
        name="Sizing Lg"
      />
      <SizeBlock
        value={`${base * 16}px`}
        tokenName={`sizing-xl`}
        name="Sizing Xl"
      />
    </>
  );
};

export default SizeBlocks;
