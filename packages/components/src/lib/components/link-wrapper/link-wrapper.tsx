import React from "react";
import styles from "./link-wrapper.module.css";
import cn from "classnames";

interface LinkWrapperProps extends React.HTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export const LinkWrapper: React.FC<LinkWrapperProps> = ({
  children,
  size = "md",
  ...rest
}) => {
  return (
    <div className={cn("flex align-center self-end")}>
      {React.Children.map(children, (child, i) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement, {
            className: cn(styles.root, styles["link-wrapper"], rest.className),
            "data-size": size,
          });
        }
      })}
    </div>
  );
};

export default LinkWrapper;
