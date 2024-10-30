import React, { useContext } from "react";
import styled from "@emotion/styled";
import { BrandContext } from "../../../../.storybook/preview";

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
  background-color: ${({ brand, mode }) =>
    `var(--${brand}-button-${mode}-color-background-primary-solid-default)`};
  border-color: ${({ brand, mode }) =>
    `var(--${brand}-button-${mode}-color-border-primary-solid-default-border-color)`};
  border-style: ${({ brand, mode }) =>
    `var(--${brand}-button-${mode}-border-primary-solid-default-border)`};
  border-width: ${({ brand, mode }) =>
    `var(--${brand}-button-${mode}-border-primary-solid-default-border-width)`};
  border-radius: ${({ brand }) => `var(--${brand}-button-shape-default)`};
  color: ${({ brand, mode }) =>
    `var(--${brand}-button-${mode}-color-text-primary-solid-default)`};
  cursor: pointer;
  display: flex;
  gap: ${({ brand }) => `var(--${brand}-button-gap-comfortable)`};
  height: 3rem;
  font-weight: ${({ brand, size = "default" }) =>
    `var(--${brand}-button-typography-${size}-font-weight)`};
  font-size: ${({ brand, size = "default" }) =>
    `var(--${brand}-button-typography-${size}-font-size)`};
  line-height: ${({ brand, size = "default" }) =>
    `var(--${brand}-button-typography-${size}-line-height)`};
  letter-spacing: ${({ brand, size = "default" }) =>
    `var(--${brand}-button-typography-${size}-letter-spacing)`};
  font-family: ${({ brand }) =>
    `var(--${brand}-button-typography-default-font-family)`};
  justify-content: center;
  outline: none;
  padding-block: ${({ brand }) => `var(--${brand}-button-size-default)`};
  padding-inline: var(--bicycling-button-space-comfortable);
  text-transform: var(--uppercase);

  span {
    transform: ${({ brand }) =>
      brand === "bicycling" ? `translateY(2px)` : "none"};
  }

  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out,
    color 0.2s ease-in-out;

  &:not(:disabled):hover {
    background-color: ${({ brand, mode }) =>
      `var(--${brand}-button-${mode}-color-background-primary-solid-hover)`};
    border-color: ${({ brand, mode }) =>
      `var(--${brand}-button-${mode}-color-border-primary-solid-hover)`};
    color: ${({ brand, mode }) =>
      `var(--${brand}-button-${mode}-color-text-primary-solid-hover)`};
  }

  &:disabled {
    opacity: var(--opacity-disabled);
    cursor: not-allowed;
  }

  &:not(:disabled):active {
    background-color: ${({ brand, mode }) =>
      `var(--${brand}-button-${mode}-color-background-primary-solid-active)`};
    border-color: ${({ brand, mode }) =>
      `var(--${brand}-button-${mode}-color-border-primary-solid-active)`};
    color: ${({ brand, mode }) =>
      `var(--${brand}-button-${mode}-color-text-primary-solid-active)`};
  }
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  disabled = false,
  size = "default",
  mode = "light",
  ...props
}) => {
  const brand = useContext(BrandContext);
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
