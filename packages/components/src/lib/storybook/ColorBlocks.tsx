import React from "react";
import ColorBlock from "./ColorBlock";

export type ColorBlocksProps = {
  color: string;
};

const ColorBlocks: React.FC<ColorBlocksProps> = ({ color }) => {
  return (
    <>
      <ColorBlock
        tokenName={`colors-${color}-50`}
        name={`${color.at(0)?.toUpperCase() + color.slice(1)} 50`}
      />
      <ColorBlock
        tokenName={`colors-${color}-100`}
        name={`${color.at(0)?.toUpperCase() + color.slice(1)} 100`}
      />
      <ColorBlock
        tokenName={`colors-${color}-200`}
        name={`${color.at(0)?.toUpperCase() + color.slice(1)} 200`}
      />
      <ColorBlock
        tokenName={`colors-${color}-300`}
        name={`${color.at(0)?.toUpperCase() + color.slice(1)} 300`}
      />
      <ColorBlock
        tokenName={`colors-${color}-400`}
        name={`${color.at(0)?.toUpperCase() + color.slice(1)} 400`}
      />
      <ColorBlock
        tokenName={`colors-${color}-500`}
        name={`${color.at(0)?.toUpperCase() + color.slice(1)} 500`}
      />
      <ColorBlock
        tokenName={`colors-${color}-600`}
        name={`${color.at(0)?.toUpperCase() + color.slice(1)} 600`}
      />
      <ColorBlock
        tokenName={`colors-${color}-700`}
        name={`${color.at(0)?.toUpperCase() + color.slice(1)} 700`}
      />
      <ColorBlock
        tokenName={`colors-${color}-800`}
        name={`${color.at(0)?.toUpperCase() + color.slice(1)} 800`}
      />
      <ColorBlock
        tokenName={`colors-${color}-900`}
        name={`${color.at(0)?.toUpperCase() + color.slice(1)} 900`}
      />
      <ColorBlock
        tokenName={`colors-${color}-950`}
        name={`${color.at(0)?.toUpperCase() + color.slice(1)} 950`}
      />
    </>
  );
};

export default ColorBlocks;
