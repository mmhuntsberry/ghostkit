import { FC } from "react";
import styled from "@emotion/styled";
import "@mmhuntsberry/tokens";

interface SubTitle {
  id?: string;
  children?: JSX.Element;
}

export const StyledSubTitle = styled.h3<SubTitle>`
  font: var(--typography-headline-5-regular);
`;

export const SubTitle: FC<SubTitle> = ({ id, children }) => {
  return <StyledSubTitle id={id}>{children}</StyledSubTitle>;
};
