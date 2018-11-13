import { Interactive, Environment, ToolButton } from "populations.js";

const lightEnvironment = new Environment({
  columns: 45,
  rows: 45,
  imgPath: "curriculum/mouse-model/populations/white.png",
  wrapEastWest: false,
  wrapNorthSouth: false
});

export const DefaultInteractive = new Interactive({
  environment: lightEnvironment,
  speedSlider: false,
  toolButtons: [
    {
      type: ToolButton.INFO_TOOL
    }, {
      type: ToolButton.CARRY_TOOL
    }
  ]
});
