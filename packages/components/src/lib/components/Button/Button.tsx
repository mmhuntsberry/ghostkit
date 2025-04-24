import React from "react";
import styles from "./button.module.css";
import cn from "classnames";

interface ExtendedCSSProperties extends React.CSSProperties {
  "--button-font"?: string;
  "--button-padding-inline-start"?: string;
  "--button-padding-inline-end"?: string;
  "--button-padding-block-start"?: string;
  "--button-padding-block-end"?: string;
}

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  background?: "solid" | "outlined" | "transparent";
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  mode?: "light" | "dark";
  radius?: "rounded" | "md" | "square";
  size?: "md" | "lg" | "xl";
  style?: ExtendedCSSProperties;
  variant?: "primary" | "neutral" | "danger";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      background = "solid",
      children,
      loading = false,
      mode = "light",
      size = "xl",
      radius = "md",
      variant = "primary",
      ...rest
    }: ButtonProps,
    ref
  ) => {
    return (
      <button
        {...rest}
        ref={ref}
        className={cn(styles.base, styles.button, rest.className)}
        data-background={background}
        data-loading={loading}
        data-mode={mode}
        data-radius={radius}
        data-size={size}
        data-variant={variant}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export default Button;
