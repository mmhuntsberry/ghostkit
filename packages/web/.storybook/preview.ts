// Import global styles
import "../../../node_modules/@mmhuntsberry/tokens/build/css/index.css";
import "@mmhuntsberry/tokens/themes/white-label";
import "@mmhuntsberry/tokens/themes/bicycling";
import "@mmhuntsberry/tokens/themes/elle";

import { StoryContext } from "@storybook/web-components";
import { html } from "lit";
import { createContext } from "@lit/context";

export const brandContext = createContext<string>("brand");

export const decorators = [
  (Story: any, context: StoryContext) => {
    const brand = context.globals.brand; // Get the current brand from Storybook's global toolbar

    console.log(`Current brand in Storybook: ${brand}`); // Debugging the brand in Storybook

    // Return the Story wrapped in BrandProvider, passing the brand dynamically
    return html`
      <brand-provider .brand="${brand}"> ${Story()} </brand-provider>
    `;
  },
];

// Global types for the Storybook toolbar
export const globalTypes = {
  brand: {
    name: "Brand",
    description: "Select the brand",
    defaultValue: "white-label",
    toolbar: {
      title: "Brand",
      items: ["white-label", "bicycling", "elle"],
    },
  },
};

// Storybook parameters for sorting
export const parameters = {
  options: {
    storySort: {
      order: ["getting-started", "foundations", "rds-components"],
    },
  },
};
export const tags = ["autodocs"];
