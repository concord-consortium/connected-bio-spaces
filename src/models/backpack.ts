import { types } from "mobx-state-tree";
import { MouseType, Mouse } from "./mouse";

export const BackpackModel = types
  .model("Backpack", {
    collectedMice: types.array(Mouse)
  })
  .actions((self) => {
    return {
      addCollectedMouse(mouse: MouseType) {
        self.collectedMice.push(mouse);
      },
      removeCollectedMouse(index: number) {
        if (index < self.collectedMice.length ) {
          self.collectedMice.splice(index, 1);
        }
      }
    };
  });

export type BackpackModelType = typeof BackpackModel.Type;
