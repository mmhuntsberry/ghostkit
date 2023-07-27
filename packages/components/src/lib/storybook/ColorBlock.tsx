import React from "react";
import styled from "@emotion/styled";
import "@mmhuntsberry/tokens";

export type ColorBlockProps = {
  color: string;
  tokenName: string;
  name: string;
};

const ColorBlockContainer = styled.div`
  display: flex;
  align-items: end;
  gap: var(--spacing-sm);
  &:not(:last-child) {
    margin-bottom: var(--spacing-xl);
  }
`;

const StyledColorBlock = styled.div<ColorBlockProps>`
  * {
    box-sizing: border-box;
  }

  border-radius: var(--radii-sm);
  display: inline-block;
  height: var(--spacing-4xl);
  width: var(--spacing-4xl);
  background: ${(props) => `var(--${props.tokenName})`};
`;

const StyledColorHeaderName = styled.h3`
  font: var(--typography-small-bold);
  margin: 0;
`;

const StyledColorTokenName = styled.h4`
  font: var(--typography-small-regular);
  margin: 0;
`;

const ColorBlock: React.FC<ColorBlockProps> = ({ color, tokenName, name }) => {
  return (
    <ColorBlockContainer>
      <StyledColorBlock
        color={color}
        tokenName={tokenName}
        name={name}
      ></StyledColorBlock>
      <div>
        <StyledColorHeaderName>
          {name.replace("colors", "").toUpperCase().trim()}
        </StyledColorHeaderName>
        <StyledColorTokenName>--{tokenName}</StyledColorTokenName>
      </div>
    </ColorBlockContainer>
  );
};

export default ColorBlock;
