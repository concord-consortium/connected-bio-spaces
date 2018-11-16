import { types } from "mobx-state-tree";

const CollectedMouse = types
  .model("CollectedMouse", {
    isCollected: false,
    isBrown: false,
    isMale: false,
    isHeterozygote: false,
    subTitle: ""
  });

export const BackpackModel = types
  .model("Backpack", {
    collectedMice: types.array(CollectedMouse)
  })
  .actions((self) => {
    return {
      addCollectedMouse(mouse: CollectedMouse) {
        self.collectedMice.push(mouse);
      }
    };
  });

export type BackpackModelType = typeof BackpackModel.Type;
