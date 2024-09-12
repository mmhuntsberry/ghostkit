import React, { useContext } from "react";
import styled from "@emotion/styled";
import { BrandContext } from "../../../../.storybook/preview";

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
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
  font: ${({ brand }) => `var(--${brand}-button-typography-default)`};
  /* font-family: ${({ brand }) =>
    `var(--${brand}-font-families-sans_serif-primary)`};
  font-size: ${({ brand }) =>
    `var(--${brand}-components-button-font-size-default)`};
  font-weight: ${({ brand }) => `var(--${brand}-font-weight-semibold)`};
  line-height: ${({ brand }) => `var(--${brand}-line-height-comfortable)`}; */
  letter-spacing: ${({ brand }) => `var(--${brand}-letter-spacing-spacious)`};
  justify-content: center;
  outline: none;
  padding-block: ${({ brand }) => `var(--${brand}-button-size-default)`};
  padding-inline: var(--space-md);
  text-transform: var(--uppercase);

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
  size = "md",
  ...props
}) => {
  const brand = useContext(BrandContext);
  return (
    <StyledButton brand={brand} disabled={disabled} size={size} {...props}>
      {children}
    </StyledButton>
  );
};
