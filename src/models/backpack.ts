import { types } from "mobx-state-tree";
import { MouseType, Mouse } from "./mouse";

export const BackpackModel = types
  .model("Backpack", {
    collectedMice: types.array(Mouse),
    maxSlots: 6
  })
  .actions((self) => {
    return {
      addCollectedMouse(mouse: MouseType) {
        if (self.collectedMice.length < self.maxSlots) {
          self.collectedMice.push(mouse);
          return true;
        }
        return false;
      },
      removeCollectedMouse(index: number) {
        if (index < self.collectedMice.length ) {
          self.collectedMice.splice(index, 1);
        }
      }
    };
  });

export type BackpackModelType = typeof BackpackModel.Type;
