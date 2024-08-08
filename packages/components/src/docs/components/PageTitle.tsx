import { FC } from "react";
import styled from "@emotion/styled";

interface PageTitle {
  id?: string;
  children?: JSX.Element;
}

export const StyledPageTitle = styled.h1<PageTitle>`
  font: var(--typography-headline-3-regular);
  color: var(--colors-blue-900);
  border-radius: var(--radii-md);
`;

export const PageTitle: FC<PageTitle> = ({ id, children }) => {
  return <StyledPageTitle id={id}>{children}</StyledPageTitle>;
};
