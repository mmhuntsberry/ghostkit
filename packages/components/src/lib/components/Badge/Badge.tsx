import React from "react";
import styles from "./badge.module.css";
import cn from "classnames";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "md" | "lg";
  color?:
    | "primary"
    | "neutral-dark"
    | "neutral-light"
    | "knockout"
    | "warning"
    | "highlight"
    | "danger"
    | "success";
  radius?: "square" | "md" | "rounded";
  children: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      size = "md",
      color = "primary",
      radius = "rounded",
      children,
      className,
      ...rest
    },
    ref
  ) => {
    return (
      <span
        {...rest}
        ref={ref}
        className={cn(styles.badge, className)}
        data-size={size}
        data-color={color}
        data-radius={radius}
      >
        {children}
      </span>
    );
  }
);
Badge.displayName = "Badge";

export default Badge;
