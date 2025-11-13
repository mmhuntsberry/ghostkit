import React from "react";
import styles from "./label.module.css";
import cn from "classnames";

export interface LabelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: "xs" | "sm";
  variant?: "default" | "knockout";
}

export const Label = React.forwardRef<HTMLDivElement, LabelProps>(
  (
    {
      children,
      size = "sm",
      variant = "default",
      className,
      ...rest
    }: LabelProps,
    ref
  ) => {
    return (
      <div
        {...rest}
        ref={ref}
        className={cn(styles.label, className)}
        data-size={size}
        data-variant={variant}
      >
        <p className={styles.text}>{children}</p>
      </div>
    );
  }
);

Label.displayName = "Label";

export default Label;
