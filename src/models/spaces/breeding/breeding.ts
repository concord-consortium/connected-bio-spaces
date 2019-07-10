import { types, Instance } from "mobx-state-tree";
import { RightPanelTypeEnum } from "../../ui";
import { BackpackMouse, BackpackMouseType } from "../../backpack-mouse";

type Parent = "mother" | "father";

export const BreedingModel = types
  .model("Breeding", {
    mother: types.maybe(types.reference(BackpackMouse)),
    father: types.maybe(types.reference(BackpackMouse)),
    offspring: types.maybe(BackpackMouse),
    rightPanel: types.optional(RightPanelTypeEnum, "instructions"),
    instructions: "Blah blah"
  })
  .actions(self => ({
    activeBackpackMouseUpdated(backpackMouse: BackpackMouseType) {
      if (backpackMouse.sex === "female" && !self.mother) {
        self.mother = backpackMouse;
        return true;
      } else if (backpackMouse.sex === "male" && !self.father) {
        self.father = backpackMouse;
        return true;
      }
    },

    removeParent(parent: Parent) {
      if (parent === "mother") {
        self.mother = undefined;
      } else {
        self.father = undefined;
      }
    }
  }));

export type BreedingModelType = Instance<typeof BreedingModel>;
