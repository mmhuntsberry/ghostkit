import React from "react";
import styles from "./badge.module.css";
import cn from "classnames";

interface BadgeProps {
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ children }) => {
  return (
    <span
      className={cn(
        styles.root,
        styles.badge,
        "text-color-secondary",
        "font-family-primary"
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
