import { FC } from "react";
import styled from "@emotion/styled";

interface PageTitle {
  id?: string;
  children?: JSX.Element;
}

export const StyledPageTitle = styled.h1<PageTitle>`
  font: var(--typography-headline-1-regular);
  background-color: var(--colors-indigo-50);
  color: var(--colors-blue-900);
  padding: calc(var(--spacing-4xl) + var(--spacing-3xl)) var(--spacing-lg)
    var(--spacing-lg);
  border-radius: var(--radii-md);
`;

export const PageTitle: FC<PageTitle> = ({ id, children }) => {
  return <StyledPageTitle id={id}>{children}</StyledPageTitle>;
};
