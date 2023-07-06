import styled from "@emotion/styled";
import "tokens";

/* eslint-disable-next-line */
export interface ComponentsProps {}

const StyledHeaderVar = styled.div`
  color: var(--colors-green-400);
  /* font-size: calc(var(--font-size-xl) / 16 * 1rem); */
  font-size: calc(var(--font-size-xl) / var(--font-size-base) * 1rem);
`;
const StyledHeaderRem = styled.div`
  color: var(--colors-green-400);
  /* font-size: calc(var(--font-size-xl) / 16 * 1rem); */
  font-size: 1.438rem;
`;

const StyledHeaderPX = styled.div`
  color: var(--colors-green-400);
  /* font-size: calc(var(--font-size-xl) / 16 * 1rem); */
  font-size: calc(var(--font-size-xl) * 1px);
`;

export function Components(props: ComponentsProps) {
  return (
    <>
      <StyledHeaderVar>Welcome to Components!</StyledHeaderVar>
      <StyledHeaderRem>Welcome to Components!</StyledHeaderRem>
      <StyledHeaderPX>Welcome to Components!</StyledHeaderPX>
    </>
  );
}

export default Components;
