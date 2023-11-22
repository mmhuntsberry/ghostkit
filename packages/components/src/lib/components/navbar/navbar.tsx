import React from "react";
import styles from "./navbar.module.css";

export const Navbar = ({ children }) => {
  return (
    <nav>
      <ul className={`${styles.root} ${styles["nav-items"]}`}>{children}</ul>
    </nav>
  );
};

export default Navbar;
