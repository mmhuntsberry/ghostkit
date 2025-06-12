import * as React from "react";
// import { Input as RadixInput } from '@radix-ui/react-input'; // Uncomment if Radix Input is available
import styles from "./input.module.css";
// import { EnvelopeSimple } from 'phosphor-react'; // Uncomment if using Phosphor Icons

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "outlined" | "solid";
  mode?: "light" | "dark";
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { variant = "outlined", mode = "light", icon, className, style, ...rest },
    ref
  ) => {
    return (
      <div
        className={styles.inputWrapper}
        data-variant={variant}
        data-mode={mode}
        style={style}
      >
        {icon && <span className={styles.icon}>{icon}</span>}
        {/* Replace input below with RadixInput if available */}
        <input ref={ref} className={styles.input} {...rest} />
      </div>
    );
  }
);

Input.displayName = "Input";
