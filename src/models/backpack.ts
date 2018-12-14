import { types } from "mobx-state-tree";
import { BackpackMouseType, BackpackMouse } from "./backpack-mouse";

export const BackpackModel = types
  .model("Backpack", {
    collectedMice: types.array(BackpackMouse),
    maxSlots: 6,
    activeMouse: types.maybe(types.reference(BackpackMouse))
  })
  .views((self) => {
    return {
      getMouseAtIndex(i?: number) {
        return i != null && i < self.collectedMice.length
          ? self.collectedMice[i]
          : null;
      },

      getMouseIndex(mouse?: BackpackMouseType) {
        return self.collectedMice.findIndex(collectedMouse => collectedMouse === mouse);
      },

      isDeselected(mouse?: BackpackMouseType) {
        return self.activeMouse && self.activeMouse !== mouse;
      },

      isSelected(mouse?: BackpackMouseType) {
        return self.activeMouse && self.activeMouse === mouse;
      }
    };
  })
  .actions((self) => {
    function deselectMouse() {
      self.activeMouse = undefined;
    }

    return {
      addCollectedMouse(mouse: BackpackMouseType) {
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
      deselectMouse,
      selectMouse(mouse?: BackpackMouseType) {
        if (mouse === self.activeMouse) {
          deselectMouse();
        } else {
          self.activeMouse = mouse;
        }
      }
    };
  });

export type BackpackModelType = typeof BackpackModel.Type;
