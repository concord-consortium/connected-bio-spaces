import { types, Instance } from "mobx-state-tree";
import { RightPanelTypeEnum } from "../../ui";
import { BackpackMouse, BackpackMouseType } from "../../backpack-mouse";
import { breed } from "../../../utilities/genetics";

type Parent = "mother" | "father";
export const BreedingTypeEnum = types.enumeration("type", ["litter", "singleGamete"]);
export type BreedingType = typeof BreedingTypeEnum.Type;

export const BreedingModel = types
  .model("Breeding", {
    breedingType: types.optional(BreedingTypeEnum, "litter"),
    mother: types.maybe(types.reference(BackpackMouse)),
    father: types.maybe(types.reference(BackpackMouse)),
    offspring: types.maybe(BackpackMouse),
    litter: types.array(BackpackMouse),
    litterSize: 8,
    rightPanel: types.optional(RightPanelTypeEnum, "instructions"),
    instructions: ""
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
      self.litter.clear();
    },

    breedLitter() {
      if (!self.mother && self.father) {
        return;
      }
      self.litter.clear();
      for (let i = 0; i < self.litterSize; i++) {
        const child = breed(self.mother!, self.father!);
        self.litter.push(BackpackMouse.create(child));
      }
    }
  }));

export type BreedingModelType = Instance<typeof BreedingModel>;
