import { types, Instance } from "mobx-state-tree";
import { createInteractive } from "./interactive";
import { Interactive } from "populations.js";

export const MousePopulationsModel = types
  .model("MousePopulations", {
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
            interactive = createInteractive(self as MousePopulationsModelType);   // not sure why I need to cast...
            (window as any).interactive = interactive;
            return interactive;
          }
        }
      },
      actions: {
      }
    };
  });

export type MousePopulationsModelType = Instance<typeof MousePopulationsModel>;
