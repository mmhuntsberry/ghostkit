import React from "react";

// Define the main Header component
export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

const Header = ({ children, ...props }: HeaderProps) => {
  return <header {...props}>{children}</header>;
};

// Define a subcomponent (Title) for Header
export interface HeaderTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

const HeaderTitle = ({ children, ...props }: HeaderTitleProps) => {
  return <h2 {...props}>{children}</h2>;
};

// Assign the subcomponent as a static property
Header.Title = HeaderTitle;

// Export the Header with subcomponents
export default Header;
