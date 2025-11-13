// .storybook/preview.tsx
import React, { useEffect } from "react";
import "@mmhuntsberry/tokens";

// Global parameter for the brand theme
export const globalTypes = {
  brand: {
    name: "Brand",
    description: "Select the brand theme",
    defaultValue: "delish",
    toolbar: {
      icon: "mirror",
      items: [
        { value: "white-label", title: "White Label" },
        { value: "delish", title: "Delish" },
        { value: "prevention", title: "Prevention" },
        { value: "best-products", title: "Best Products" },
      ],
      showName: true,
    },
  },
};

// Global decorator that dynamically loads the corresponding CSS file
export const decorators = [
  (Story, context) => {
    const { brand } = context.globals;

    useEffect(() => {
      const linkId = "brand-css";
      let brandLink = document.getElementById(linkId) as HTMLLinkElement | null;

      if (!brandLink) {
        brandLink = document.createElement("link");
        brandLink.id = linkId;
        brandLink.rel = "stylesheet";
        document.head.appendChild(brandLink);
      }

      // Update the link's href based on the selected brand theme
      brandLink.href = `/build/css/${brand}.css`;
    }, [brand]);

    return <Story />;
  },
];

// You can keep additional Storybook configurations here as well.
export {};
