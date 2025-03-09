import React, { useContext } from "react";

import { Button } from "../Button";

export const Demo = (props) => {
  return (
    <div>
      <Button {...props}>{props.children}</Button>
    </div>
  );
};
