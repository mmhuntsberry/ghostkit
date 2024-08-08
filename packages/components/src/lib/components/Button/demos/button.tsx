import React, { useContext } from "react";
import { BrandContext } from "../../../../../.storybook/preview";
import { Button } from "../Button";

<<<<<<< HEAD
<<<<<<< HEAD
export const Demo = (props) => {
=======
export const Demo = () => {
>>>>>>> 059c679 (update core)
=======
export const Demo = (props) => {
>>>>>>> 3578155 (update core)
  const brand = useContext(BrandContext);

  return (
    <div>
      <h1>This is a {brand} branded story</h1>
<<<<<<< HEAD
<<<<<<< HEAD
      <Button {...props} brand={brand || "white-label"}>
        Button Text
      </Button>
=======
      <Button brand={brand || "white-label"}>Button Text</Button>
>>>>>>> 059c679 (update core)
=======
      <Button {...props} brand={brand || "white-label"}>
        Button Text
      </Button>
>>>>>>> 3578155 (update core)
    </div>
  );
};
