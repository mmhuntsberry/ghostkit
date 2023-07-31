import React from "react";

import styled from "@emotion/styled";
import "@mmhuntsberry/tokens";

export type TokenTableProps = {
  children: React.ReactNode;
};

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const StyledTableHeader = styled.thead`
  font: var(--typography-small-bold);
  padding: var(--spacing-2xl) var(--spacing-2xl) var(--spacing-xl) 0;
`;

const StyledTh = styled.th`
  padding: 0 0 var(--spacing-xl) 0;
  text-align: ${(props) => props.align};
  border-bottom: 1px solid var(--colors-grey-300);
`;

const StyledTableBody = styled.tbody`
  font: var(--typography-small-regular);

  &::before {
    content: "";
    display: block;
    height: var(--spacing-xl);
  }
`;

const TokenTable: React.FC<TokenTableProps> = ({ children }) => {
  return (
    <StyledTable className="docs-table">
      <StyledTableHeader>
        <tr>
          <StyledTh align="left">Name</StyledTh>
          <StyledTh align="left">Custom Property</StyledTh>
          <StyledTh align="right">Value</StyledTh>
        </tr>
      </StyledTableHeader>
      <StyledTableBody className="docs-table-body">{children}</StyledTableBody>
    </StyledTable>
  );
};

export default TokenTable;
