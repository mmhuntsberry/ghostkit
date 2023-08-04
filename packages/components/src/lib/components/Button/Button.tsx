import React from "react";
import styled from "@emotion/styled";
import "@mmhuntsberry/tokens";

export interface ButtonProps {
  disabled?: boolean;
  kind: "primary" | "secondary" | "text";
  size?: "sm" | "md" | "lg";
  theme?: string;
  mode?: string;
  children?: React.ReactNode;
}

const StyledButton = styled.button<ButtonProps>`
  * {
    box-sizing: border-box;
  }

  align-items: center;
  background: ${(props) =>
    `var(--${props.theme}-button-color-background-${props.kind}-default-on-${props.mode})`};
  border: ${(props) =>
    `var(--${props.theme}-button-border-${props.kind}-default-on-${props.mode})`};
  border-radius: ${(props) => `var(--${props.theme}-button-radius)`};
  color: ${(props) =>
    `var(--${props.theme}-button-color-text-${props.kind}-default-on-${props.mode})`};
  cursor: pointer;
  display: flex;
  font: var(--typography-button-normal-bold);
  justify-content: center;
  outline: none;
  padding: ${(props) =>
    `var(--${props.theme}-button-size-${props.kind}-${props.size})`};
  text-transform: uppercase;
  transition: background 0.2s ease-in-out;

  &:hover {
    background: ${(props) =>
      `var(--${props.theme}-button-color-background-${props.kind}-hover-on-${props.mode})`};
  }

  &:disabled {
    background: ${(props) =>
      `var(--${props.theme}-button-color-background-${props.kind}-disabled-on-${props.mode})`};
    color: ${(props) =>
      `var(--${props.theme}-button-color-text-${props.kind}-disabled-on-${props.mode})`};
    border: ${(props) =>
      `var(--${props.theme}-button-border-${props.kind}-disabled-on-${props.mode})`};
    cursor: not-allowed;
  }

  &:focus {
    box-shadow: ${(props) =>
      `var(--${props.theme}-button-color-shadow-${props.kind}-focus-on-${props.mode});`};
    border: ${(props) =>
      `var(--${props.theme}-button-border-${props.kind}-focus-on-${props.mode})`};
  }
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  disabled = false,
  kind = "primary",
  mode = "light",
  size = "md",
  theme = "toolkit",
  ...props
}) => {
  return (
    <StyledButton
      disabled={disabled}
      kind={kind}
      mode={mode}
      size={size}
      theme={theme}
      {...props}
    >
      {children}
    </StyledButton>
  );
};
