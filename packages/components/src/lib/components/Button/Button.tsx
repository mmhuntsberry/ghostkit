import React from "react";
import styled from "@emotion/styled";
import "@mmhuntsberry/tokens";

export type ButtonProps = {
  disabled?: boolean;
  kind: "primary" | "secondary" | "text";
  size?: "sm" | "md" | "lg";
  theme?: string;
  children?: React.ReactNode;
};

const StyledButton = styled.button<ButtonProps>`
  * {
    box-sizing: border-box;
  }

  align-items: center;
  background: ${(props) =>
    `var(--${props.theme}-button-color-background-${props.kind}-default)`};
  border: ${(props) =>
    `var(--${props.theme}-button-border-${props.kind}-default)`};
  border-radius: ${(props) => `var(--${props.theme}-button-radius)`};
  color: ${(props) =>
    `var(--${props.theme}-button-color-text-${props.kind}-default)`};
  cursor: pointer;
  display: flex;
  font: var(--typography-button-normal-bold);
  justify-content: center;
  /* letter-spacing: -0.00813rem; */
  /* max-height: 2.5rem; */
  outline: none;
  padding: ${(props) =>
    `var(--${props.theme}-button-size-${props.kind}-${props.size})`};
  text-transform: uppercase;
  transition: background 0.2s ease-in-out;

  &:hover {
    background: ${(props) =>
      `var(--${props.theme}-button-color-background-${props.kind}-hover)`};
  }

  &:disabled {
    background: ${(props) =>
      `var(--${props.theme}-button-color-background-${props.kind}-disabled)`};
    color: var(--theme-fg-on-disabled);
    cursor: not-allowed;
  }

  &:focus {
    box-shadow: ${(props) =>
      `var(--${props.theme}-button-color-shadow-${props.kind}-focus);`};
    border: ${(props) =>
      `var(--${props.theme}-button-border-${props.kind}-focus)`};
  }
`;

const Button: React.FC<ButtonProps> = ({
  children,
  disabled = false,
  kind = "primary",
  size = "md",
  theme = "toolkit",
}) => {
  return (
    <StyledButton disabled={disabled} size={size} theme={theme} kind={kind}>
      {children}
    </StyledButton>
  );
};

export default Button;
