import React from "react";
import styled from "@emotion/styled";
import "@mmhuntsberry/tokens";

type ButtonProps = {
  variant: "primary" | "secondary" | "tertiary";
  disabled?: boolean;
  // state?: "default" | "hover" | "focused" | "disabled";
  children?: React.ReactNode;
};

const StyledButton = styled.button<ButtonProps>`
  * {
    box-sizing: border-box;
  }
  align-items: center;
  background: ${(props) =>
    props.variant === "primary" && "var(--theme-accent-default)"};
  /* border: ${(props) =>
    props.variant === "primary" && `1px solid var(--theme-accent-default)`}; */
  border: none;
  border-radius: 0.25rem;
  color: ${(props) =>
    props.variant === "primary" && "var(--theme-fg-on-accent)"};
  cursor: pointer;
  display: flex;
  font: var(--typography-button-normal-bold);
  justify-content: center;
  /* letter-spacing: -0.00813rem; */
  max-height: 2.5rem;
  outline: none;
  padding: 12px;
  text-transform: uppercase;
  transition: background 0.2s ease-in-out;

  &:hover {
    background: ${(props) =>
      props.variant === "primary" && "var(--theme-accent-muted)"};
  }

  &:disabled {
    background: var(--theme-accent-disabled);
    color: var(--theme-fg-on-disabled);
    cursor: not-allowed;
  }
`;

const Button: React.FC<ButtonProps> = ({
  children,
  disabled = false,
  variant = "primary",
}) => {
  return (
    <StyledButton disabled={disabled} variant={variant}>
      {children}
    </StyledButton>
  );
};

export default Button;
