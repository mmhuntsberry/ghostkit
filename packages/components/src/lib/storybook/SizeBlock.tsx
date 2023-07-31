import React from "react";
import styled from "@emotion/styled";
import "@mmhuntsberry/tokens";

export type SizeBlockProps = {
  tokenName: string;
  name: string;
  value?: string;
};

export type StyledSizeTokenTextProps = {
  tokenName?: string;
  value?: string;
};

const SizeBlockContainer = styled.div`
  display: flex;
  align-items: end;
  gap: var(--spacing-sm);
  &:not(:last-child) {
    margin-bottom: var(--spacing-xl);
  }
`;

const StyledSizeBlock = styled.div<SizeBlockProps>`
  * {
    box-sizing: border-box;
  }

  border-radius: var(--radii-sm);
  display: inline-block;
  background-color: var(--colors-blue-500);
  height: ${(props) => `var(--${props.tokenName})`};
  width: ${(props) => `var(--${props.tokenName})`};
`;

const StyledSizeHeaderName = styled.h3`
  font: var(--typography-small-bold);
  display: inline-block;
  margin: 0;
`;

const StyledSizeTokenText = styled.h4<StyledSizeTokenTextProps>`
  font: var(--typography-small-regular);
  margin: 0;
`;

const SizeBlock: React.FC<SizeBlockProps> = ({ tokenName, name, value }) => {
  return (
    <SizeBlockContainer>
      <StyledSizeBlock tokenName={tokenName} name={name}></StyledSizeBlock>
      <div>
        <StyledSizeHeaderName>
          {name.replace("Sizes", "").toUpperCase().trim()}
        </StyledSizeHeaderName>
        <StyledSizeTokenText
          style={{ display: "inline-block", marginLeft: "8px" }}
        >
          ({value})
        </StyledSizeTokenText>
        <StyledSizeTokenText>--{tokenName}</StyledSizeTokenText>
      </div>
    </SizeBlockContainer>
  );
};

export default SizeBlock;
