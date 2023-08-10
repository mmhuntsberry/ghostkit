import React from "react";
import styles from "./Button.module.css";

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  kind: "primary" | "secondary" | "text";
  size?: "sm" | "md" | "lg";
  theme?: string;
  mode?: string;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  disabled = false,
  kind = "primary",
  mode = "light",
  size = "md",
  theme = "toolkit",
  ...props
}) => {
  const buttonClassName = [
    styles.button,
    styles[kind], // Primary, secondary, or text
    styles[size], // Apply the size style based on data attribute
    // styles[mode],
  ].join(" ");

  return (
    <button
      className={buttonClassName}
      data-size={size} // Pass the dynamic size value as a data attribute
      disabled={disabled}
      data-mode={mode}
      {...props}
    >
      {children}
    </button>
  );
};
