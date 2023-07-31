import { FC } from "react";
import styled from "@emotion/styled";
import "@mmhuntsberry/tokens";

interface SectionTitle {
  id?: string;
  children?: JSX.Element;
}

export const StyledSectionTitle = styled.h2<SectionTitle>`
  font: var(--typography-headline-4-regular);
`;

export const SectionTitle: FC<SectionTitle> = ({ id, children }) => {
  return <StyledSectionTitle id={id}>{children}</StyledSectionTitle>;
};
