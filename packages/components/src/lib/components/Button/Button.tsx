import React from "react";
import styled from "@emotion/styled";

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  disabled?: boolean;

  mode?: string;
  size?: "sm" | "md" | "lg";
  brand?: string;
}

const customProp = (props: ButtonProps) =>
  props.brand !== "primitive" ? `${props.brand}-` : "";

const StyledButton = styled.button<ButtonProps>`
  box-sizing: border-box;

  align-items: center;
  background-color: var(
    --button-color-background-primary-solid-default-on_light
  );
  border-color: var(--button-color-border-primary-default-on_light);
  border-style: var(--solid); // TODO: Make this dynamic based on mode
  border-width: var(--border-width-thin);
  border-radius: var(--border-radius-rounded);
  color: var(--button-color-text-on_dark);
  cursor: pointer;
  display: flex;
  font-family: var(--font-families-sans_serif);
  font-size: var(--components-button-font-size-default);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-comfortable);
  letter-spacing: var(--letter-spacing-spacious);
  justify-content: center;
  outline: none;
  padding-block: var(--size-md);
  padding-inline: var(--space-md);
  text-transform: var(--uppercase);

  transition: background 0.2s ease-in-out;

  &:not(:disabled):hover {
    background-color: var(
      --button-color-background-primary-solid-hover-on_light
    );
    border-color: var(--button-color-border-primary-hover-on_light);
  }

  &:disabled {
    opacity: var(--disabled);
    cursor: not-allowed;
  }

  &:not(:disabled):active {
    background-color: var(
      --button-color-background-primary-solid-active-on_light
    );
    border-color: var(--button-color-border-primary-active-on_light);
  }
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  disabled = false,

  mode = "light",
  size = "md",
  brand = "",
  ...props
}) => {
  console.log(brand);
  return (
    <StyledButton
      disabled={disabled}
      mode={mode}
      size={size}
      brand={brand}
      {...props}
    >
      {children}
    </StyledButton>
  );
};
