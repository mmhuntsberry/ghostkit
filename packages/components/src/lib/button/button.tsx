import React from "react";
import styled from "@emotion/styled";
import "@mmhuntsberry/tokens";

type ButtonProps = {
  variant: "primary" | "secondary" | "tertiary";
  state?: "default" | "hover" | "focused" | "disabled";
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
`;

const Button: React.FC<ButtonProps> = ({ children, variant = "primary" }) => {
  return <StyledButton variant={variant}>{children}</StyledButton>;
};

export default Button;
