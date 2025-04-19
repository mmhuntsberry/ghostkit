import React from "react";
import styles from "./card.module.css";

interface ExtendedCSSProperties extends React.CSSProperties {}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = ({ children, ...props }: CardProps) => {
  return <div {...props}>{children}</div>;
};
Card.displayName = "Card";

export default Card;
