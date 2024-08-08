import React from "react";
import ColorBlock from "./ColorBlock";

export type ColorBlocksProps = {
  color: string;
};

const ColorBlocks: React.FC<ColorBlocksProps> = ({ color }) => {
  return (
    <>
      <ColorBlock tokenName={`colors-${color}-50`} name={`50`} />
      <ColorBlock tokenName={`colors-${color}-100`} name={`100`} />
      <ColorBlock tokenName={`colors-${color}-200`} name={`200`} />
      <ColorBlock tokenName={`colors-${color}-300`} name={`300`} />
      <ColorBlock tokenName={`colors-${color}-400`} name={`400`} />
      <ColorBlock tokenName={`colors-${color}-500`} name={`500`} />
      <ColorBlock tokenName={`colors-${color}-600`} name={`600`} />
      <ColorBlock tokenName={`colors-${color}-700`} name={`700`} />
      <ColorBlock tokenName={`colors-${color}-800`} name={`800`} />
      <ColorBlock tokenName={`colors-${color}-900`} name={`900`} />
      <ColorBlock tokenName={`colors-${color}-950`} name={`950`} />
    </>
  );
};

export default ColorBlocks;
