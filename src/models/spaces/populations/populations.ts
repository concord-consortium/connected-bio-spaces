import { types, Instance } from "mobx-state-tree";
import { DefaultInteractive } from "./mouse-model/defaults";

const currentInteractive = DefaultInteractive;

export const PopulationsModel = types
  .model("Populations", {
  })
  .extend(self => {

    return {
      views: {
        get interactive() {
          return currentInteractive;
        }
      },
      actions: {

      }
    };
  });

export type PopulationsModelType = Instance<typeof PopulationsModel>;
