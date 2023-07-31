import React from "react";
import styled from "@emotion/styled";

type TokenBlockProps = {
  children?: React.ReactNode;
  tokenName?: string;
  name?: string;
  value?: string;
  type: "color" | "size";
};

const TokenRow = styled.tr`
  &:not(:last-child) {
    margin-bottom: var(--spacing-xl);
  }
`;

const StyledTokenBlock = styled.div<TokenBlockProps>`
  * {
    box-sizing: border-box;
  }

  border-radius: ${(props) =>
    props.type === "size" ? "var(--radii-sm)" : "var(--radii-sm)"};
  display: ${(props) =>
    props.type === "size" ? "inline-block" : "inline-block"};
  height: ${(props) =>
    props.type === "size" ? `var(--${props.tokenName})` : "var(--spacing-2xl)"};
  width: ${(props) =>
    props.type === "size" ? `var(--${props.tokenName})` : "var(--spacing-2xl)"};
  background: ${(props) =>
    props.type === "color"
      ? `var(--${props.tokenName})`
      : "var(--colors-blue-500)"};
`;

const StyledTokenHeaderName = styled.h5`
  font: var(--typography-small-bold);
  display: inline-block;
  margin: 0;
`;

const StyledTokenText = styled.h4<Partial<TokenBlockProps>>`
  font: var(--typography-small-regular);
  margin: 0;
`;

const TokenBlock: React.FC<TokenBlockProps> = ({
  tokenName = "",
  name = "",
  value = "",
  type = "color",
}) => {
  return (
    <TokenRow type={type}>
      <td>
        <StyledTokenHeaderName>
          {name
            .replace(type === "color" ? "colors" : "Sizes", "")
            .toUpperCase()
            .trim()}
        </StyledTokenHeaderName>
        {type === "size" && (
          <StyledTokenText
            style={{ display: "inline-block", marginLeft: "2px" }}
          >
            {" "}
            ({value})
          </StyledTokenText>
        )}
      </td>
      <td>
        <StyledTokenText>--{tokenName}</StyledTokenText>
      </td>
      <td align="right">
        <StyledTokenBlock
          tokenName={tokenName}
          name={name}
          type={type}
        ></StyledTokenBlock>
      </td>
    </TokenRow>
  );
};

export default TokenBlock;
