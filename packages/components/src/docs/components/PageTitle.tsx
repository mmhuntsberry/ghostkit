import { FC } from "react";
import styled from "@emotion/styled";

interface PageTitle {
  id?: string;
  children?: JSX.Element;
}

export const StyledPageTitle = styled.h1<PageTitle>`
  font: var(--typography-headline-3-regular);
<<<<<<< HEAD
=======
  color: var(--colors-blue-900);
>>>>>>> 8224f25 (fix conflicts)
  border-radius: var(--radii-md);
  margin: var(--spacing-xl) 0;
`;

export const PageTitle: FC<PageTitle> = ({ id, children }) => {
  return <StyledPageTitle id={id}>{children}</StyledPageTitle>;
};
