import { types, Instance } from "mobx-state-tree";
import { createInteractive, EnvironmentColor, HawksMiceInteractive } from "./hawks-mice-interactive";
import { Interactive } from "populations.js";
import { ToolbarButton } from "../populations";

export const MousePopulationsModel = types
  .model("MousePopulations", {
    environment: "white" as EnvironmentColor,
    numHawks: 2,
    addMiceByColor: true,
    percentWhite: 0.5,
    percentbb: 0.33,
    percentBb: 0.33,
    showHeteroStack: false,
    showSexStack: false
  })
  .extend(self => {
    let interactive: HawksMiceInteractive;

    return {
      views: {
        get interactive(): Interactive {
          if (interactive) {
            return interactive;
          } else {
            interactive = createInteractive(self as MousePopulationsModelType);
            return interactive;
          }
        },

        get toolbarButtons(): ToolbarButton[] {
          const buttons = [];

          buttons.push({
            title: "Add Mice",
            action: (e: any) => {
              if (self.addMiceByColor) {
                const white = self.percentWhite;
                const brown = 1 - white;
                interactive.addInitialMicePopulation(20, true, {white, brown});
              } else {
                const bb = self.percentbb;
                const Bb = self.percentBb;
                const BB = 1 - bb - Bb;
                interactive.addInitialMicePopulation(20, false, {bb, Bb, BB});
              }
            }
          });

          buttons.push({
            title: "Add Hawks",
            action: (e: any) => {
              interactive.addInitialHawksPopulation(self.numHawks);
            }
          });

          return buttons;
        },

        get environmentColor(): EnvironmentColor {
          switch (self.environment) {
            case "white":
            case "brown":
            case "neutral":
              return self.environment;
            default:
              return "white";
          }
        }
      },
      actions: {
        setEnvironmentColor(color: EnvironmentColor) {
          self.environment = color;
        }
      }
    };
  });

export type MousePopulationsModelType = Instance<typeof MousePopulationsModel>;
