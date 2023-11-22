import React from "react";
import styles from "./link-wrapper.module.css";
import cn from "classnames";

interface LinkWrapperProps {
  children: React.ReactNode;
}

export const LinkWrapper: React.FC<LinkWrapperProps> = ({ children }) => {
  return (
    <div className="flex align-center self-end">
      {React.Children.map(children, (child, i) => {
        const childClassName = cn({
          [styles.root]: i === 0,
          [styles["link-wrapper"]]: i === 0,
        });
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement, {
            className: childClassName,
          });
        }
      })}
    </div>
  );
};

export default LinkWrapper;
