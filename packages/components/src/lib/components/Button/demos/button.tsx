import React, { useContext } from "react";
import { BrandContext } from "../../../../../.storybook/preview";
import { Button } from "../Button";

export const Demo = (props) => {
  const brand = useContext(BrandContext);

  return (
    <div>
      <h1>This is a {brand} branded story</h1>
      <Button {...props} brand={brand || "white-label"}>
        Button Text
      </Button>
    </div>
  );
};
