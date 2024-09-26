import React, { useContext } from "react";
import styled from "@emotion/styled";
import { BrandContext } from "../../../../.storybook/preview";

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  disabled?: boolean;
  size?: "xs" | "sm" | "default";
  brand?: string;
}

const StyledButton = styled.button<ButtonProps>`
  box-sizing: border-box;

  align-items: center;
  background-color: ${({ brand }) =>
    `var(--${brand}-button-color-background-primary-solid-default-on_light)`};
  border-color: ${({ brand }) =>
    `var(--${brand}-button-color-border-primary-default-on_light)`};
  border-style: var(--solid); // TODO: Make this dynamic based on mode
  border-width: var(--border-width-thin);
  border-radius: ${({ brand }) => `var(--${brand}-button-shape-default)`};
  color: ${({ brand }) => `var(--${brand}-button-color-text-on_dark)`};
  cursor: pointer;
  display: flex;
  gap: ${({ brand }) => `var(--${brand}-button-gap-comfortable)`};
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

  transition: background 0.2s ease-in-out;

  &:not(:disabled):hover {
    background-color: ${({ brand }) =>
      `var(--${brand}-button-color-background-primary-solid-hover-on_light)`};
    border-color: ${({ brand }) =>
      `var(--${brand}-button-color-border-primary-hover-on_light)`};
  }

  &:disabled {
    opacity: var(--opacity-disabled);
    cursor: not-allowed;
  }

  &:not(:disabled):active {
    background-color: ${({ brand }) =>
      `var(--${brand}-button-color-background-primary-solid-active-on_light)`};
    border-color: ${({ brand }) =>
      `var(--${brand}-button-color-border-primary-active-on_light)`};
  }
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  disabled = false,
  size = "default",
  ...props
}) => {
  const brand = useContext(BrandContext);
  return (
    <StyledButton brand={brand} disabled={disabled} size={size} {...props}>
      {children}
    </StyledButton>
  );
};
