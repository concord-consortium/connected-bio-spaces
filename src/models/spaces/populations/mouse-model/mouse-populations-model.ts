import { types, Instance } from "mobx-state-tree";
import { createInteractive, EnvironmentColor } from "./hawks-mice-interactive";
import { Interactive } from "populations.js";

export const MousePopulationsModel = types
  .model("MousePopulations", {
    environment: "white" as EnvironmentColor,
    numHawks: 2,
    showHeteroStack: false,
    showSexStack: false
  })
  .extend(self => {
    let interactive: Interactive;

    return {
      views: {
        get interactive(): Interactive {
          if (interactive) {
            return interactive;
          } else {
            interactive = createInteractive(self as MousePopulationsModelType);
            (window as any).interactive = interactive;
            return interactive;
          }
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
