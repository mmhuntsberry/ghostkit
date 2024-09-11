// import "../../tokens/build/css/index.css";
import "../../../node_modules/@mmhuntsberry/tokens/build/css/index.css";
import "@mmhuntsberry/tokens/themes/white-label";
import "@mmhuntsberry/tokens/themes/bicycling";
// import "@mmhuntsberry/fonts";
import React, { useEffect, useContext } from "react";
import { Meta, StoryContext } from "@storybook/react";

export const BrandContext = React.createContext("white-label");

export const decorators = [
  (Story, context: StoryContext) => {
    useEffect(() => {
      const brand = context.globals.brand;
      if (brand && brand !== "default") {
        import(
          `../../../node_modules/@mmhuntsberry/tokens/build/css/brands/${brand}/${brand}.css`
        )
          .then(() => console.log(`Successfully loaded styles for ${brand}`))
          .catch((err) =>
            console.error(`Failed to load styles for ${brand}:`, err)
          );
      }
    }, [context.globals.brand]);

    return (
      <BrandContext.Provider value={context.globals.brand}>
        <Story />
      </BrandContext.Provider>
    );
  },
];
export const globalTypes = {
  brand: {
    name: "Brand",
    description: "Select the brand",
    defaultValue: "white-label",
    toolbar: {
      // icon: "globe",
      title: "Brand",
      items: [
        "primitive",
        "white-label",

        // "alta",
        // "autoweek",
        // "best-products",
        "bicycling",
        // "biography",
        // "car-and-driver",
        // "cosmopolitan",
        // "country-living",
        // "delish",
        "elle",
        // "elle-decor",
        // "esquire",
        // "good-housekeeping",
        // "harpers-bazaar",
        // "house-beautiful",
        // "mens-health",
        // "oprah-daily",
        // "popular-mechanics",
        // "redbook",
        // "road-and-track",
      ],
    },
  },
};

export const parameters = {
  options: {
    storySort: {
      order: ["getting-started", "foundations", "rds-components"],
    },
  },
};
