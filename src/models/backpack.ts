import { types } from "mobx-state-tree";
import { MouseType, Mouse } from "./mouse";

export const BackpackModel = types
  .model("Backpack", {
    collectedMice: types.array(Mouse),
    maxSlots: 6,
    activeSlot: types.maybe(types.number)
  })
  .views((self) => {
    return {
      getMouseAtIndex(i?: number) {
        return i != null && i < self.collectedMice.length
          ? self.collectedMice[i]
          : null;
      }
    };
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
      },
      selectSlot(index?: number) {
        self.activeSlot = index;
      },
      deselectSlot() {
        self.activeSlot = undefined;
      }
    };
  });

export type BackpackModelType = typeof BackpackModel.Type;
