import React from "react";
import styled from "@emotion/styled";
import "@mmhuntsberry/tokens";
import "../../../index.css";

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  disabled?: boolean;
  kind?: "primary" | "secondary" | "text";
  mode?: string;
  size?: "sm" | "md" | "lg";
  brand?: string;
}

const customProp = (props) =>
  props.brand !== "primitive" ? `${props.brand}-` : "";

const StyledButton = styled.button<ButtonProps>`
  * {
    box-sizing: border-box;
  }

  align-items: center;
  background-color: ${(props) =>
    `var(--${customProp(props)}button-theme-bg-primary-default-fill)`};
  border: ${(props) =>
    `var(--${customProp(
      props
    )}button-theme-border-primary-default-border-color)`};
  border-radius: ${(props) =>
    `var(--${customProp(props)}button-size-border-default-border-radius)`};
  color: ${(props) =>
    `var(--${customProp(props)}button-theme-text-default-fill)`};
  cursor: pointer;
  display: flex;
  font-family: ${(props) =>
    `var(--${customProp(props)}button-size-text-default-font-families)`};
  justify-content: center;
  outline: none;
  padding-block: ${(props) =>
    `var(--${customProp(props)}button-size-bg-default-vertical-padding)`};
  padding-inline: ${(props) =>
    `var(--${customProp(props)}button-size-bg-default-horizontal-padding)`};
  text-transform: ${(props) =>
    `var(--${customProp(props)}button-size-text-default-text-case)`};

  transition: background 0.2s ease-in-out;

  &:hover {
    background-color: ${(props) =>
      `var(--${customProp(props)}button-theme-bg-primary-hover-fill)`};
  }

  &:disabled {
    background-color: ${(props) =>
      `var(--${customProp(props)}button-theme-bg-primary-disabled-fill)`};
    color: ${(props) =>
      `var(--${customProp(props)}button-theme-text-disabled-fill)`};
    border: ${(props) =>
      `var(--${customProp(
        props
      )}button-theme-border-primary-disabled-border-color)`};
    cursor: not-allowed;
  }

  &:active {
    background-color: ${(props) =>
      `var(--${customProp(props)}button-theme-bg-primary-active-fill)`};
    border: ${(props) =>
      `var(--${customProp(
        props
      )}button-theme-border-primary-active-border-color)`};
  }
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  disabled = false,
  kind = "primary",
  mode = "light",
  size = "md",
  brand = "",
  ...props
}) => {
  console.log(brand);
  return (
    <StyledButton
      disabled={disabled}
      kind={kind}
      mode={mode}
      size={size}
      brand={brand}
      {...props}
    >
      {children}
    </StyledButton>
  );
};
