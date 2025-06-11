import React from "react";

export interface ExtendedCSSProperties extends React.CSSProperties {}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  background?: "solid" | "outlined" | "transparent";
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  mode?: "light" | "dark";
  rounded?: "left" | "right" | "all" | "none";
  size?: "md" | "lg" | "xl";
  variant?: "primary" | "neutral" | "danger";
  width?: "auto" | "full";
  style?: ExtendedCSSProperties;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      background = "solid",
      children,
      loading = false,
      mode = "light",
      size = "xl",
      rounded = "all",
      variant = "primary",
      width = "auto",
      ...rest
    }: ButtonProps,
    ref
  ) => {
    return (
      <button
        {...rest}
        ref={ref}
        data-background={background}
        data-loading={loading}
        data-mode={mode}
        data-rounded={rounded}
        data-size={size}
        data-variant={variant}
        data-width={width}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
