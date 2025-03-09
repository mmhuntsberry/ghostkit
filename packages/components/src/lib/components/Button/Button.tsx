import React, { useContext } from "react";
import styled from "@emotion/styled";

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  disabled?: boolean;
  size?: "xs" | "sm" | "default";
  brand?: string;
  mode?: "light" | "dark";
}

const StyledButton = styled.button<ButtonProps>`
  box-sizing: border-box;

  align-items: center;
  background-color: ${(props) => `var(--button-theme-bg-primary-default-fill)`};
  border: ${(props) => `--button-theme-border-primary-default-border-color)`};
  border-radius: ${(props) =>
    `var(--button-size-border-default-border-radius)`};
  color: ${(props) => `var(--button-theme-text-default-fill)`};
  cursor: pointer;
  display: flex;
  font-family: ${(props) => `var(--button-size-text-default-font-families)`};
  font-size: ${(props) => `var(--button-size-text-default-font-sizes)`};
  font-weight: ${(props) => `var(--button-size-text-default-font-weights)`};
  letter-spacing: ${(props) =>
    `var(--button-size-text-default-letter-spacing)`};
  justify-content: center;
  outline: none;
  padding-block: ${(props) => `var(--button-size-bg-default-vertical-padding)`};
  padding-inline: ${(props) =>
    `var(--button-size-bg-default-horizontal-padding)`};
  text-transform: ${(props) => `var(--button-size-text-default-text-case)`};

  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out,
    color 0.2s ease-in-out;

  &:hover {
    background-color: ${(props) => `var(--button-theme-bg-primary-hover-fill)`};
  }

  &:disabled {
    background-color: ${(props) =>
      `var(--button-theme-bg-primary-disabled-fill)`};
    color: ${(props) => `var(--button-theme-text-disabled-fill)`};
    border: ${(props) =>
      `var(--${customProp(
        props
      )}button-theme-border-primary-disabled-border-color)`};
    cursor: not-allowed;
  }

  &:active {
    background-color: ${(props) =>
      `var(--button-theme-bg-primary-active-fill)`};
    border: ${(props) =>
      `var(--${customProp(
        props
      )}button-theme-border-primary-active-border-color)`};
  }
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  disabled = false,
  size = "default",
  mode = "light",
  brand = "bicycling",
  ...props
}) => {
  return (
    <StyledButton
      brand={brand}
      disabled={disabled}
      size={size}
      mode={mode}
      {...props}
    >
      {children}
    </StyledButton>
  );
};
