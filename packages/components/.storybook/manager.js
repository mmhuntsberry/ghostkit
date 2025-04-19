import { create } from "@storybook/theming";
import { addons } from "@storybook/addons";

import logo from "./Logo/resin_black.svg";

// Read a query parameter from the URL to determine which manager theme to load.
// This allows you to switch the manager UI by adding ?managerTheme=delish (or prevention, or white-label)
const urlParams = new URLSearchParams(window.location.search);
const managerThemeParam = urlParams.get("managerTheme") || "white-label";

// Define the white-label theme
const whiteLabelTheme = create({
  base: "light",
  brandTitle: "White Label",
  brandUrl: "",
  brandImage: logoWhiteLabel,
  barSelectedColor: "#3d53f5",
  // You can add or override additional Storybook theme properties here.
});

// Define the delish theme
const delishTheme = create({
  base: "light",
  brandTitle: "Delish",
  brandUrl: "",
  brandImage: logoDelish,
  barSelectedColor: "#3d53f5",
  // Additional customizations for the delish brand...
});

// Define the prevention theme
const preventionTheme = create({
  base: "light",
  brandTitle: "Prevention",
  brandUrl: "",
  brandImage: logoPrevention,
  barSelectedColor: "#3d53f5",
  // Additional customizations for the prevention brand...
});

let selectedTheme;
switch (managerThemeParam) {
  case "delish":
    selectedTheme = delishTheme;
    break;
  case "prevention":
    selectedTheme = preventionTheme;
    break;
  case "white-label":
  default:
    selectedTheme = whiteLabelTheme;
    break;
}

window.STORYBOOK_GA_ID = "UA-308574295";
window.STORYBOOK_REACT_GA_OPTIONS = {};

const theme = create({
  base: "light",
  brandImage: logo,
  // brandUrl: "",
  // colorPrimary: "blue",
  // barSelectedColor: "#3d53f5",
  // brandTitle: "Resin Design",
  background: {
    // hoverable: "rgba(#3d53f5, 0.1)",
  },
  // hoverable: "rgba(#3d53f5, 0.1)",
});

addons.setConfig({
  theme: selectedTheme,

  sidebar: {
    renderLabel: ({ name, type }) =>
      type === "story" ? name : name.at(0).toUpperCase() + name.slice(1),
  },
});
