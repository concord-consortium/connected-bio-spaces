import { types, Instance } from "mobx-state-tree";
import { RightPanelTypeEnum } from "../../ui";
import { BackpackMouse, BackpackMouseType } from "../../backpack-mouse";
import { breed, createGamete, fertilize } from "../../../utilities/genetics";

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
    motherGamete: types.maybe(types.string),
    fatherGamete: types.maybe(types.string),
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

    removeOrganism(org: "mother" | "father" | "offspring") {
      if (org === "mother") {
        self.mother = undefined;
      } else if (org === "father") {
        self.father = undefined;
      } else if (org === "offspring") {
        self.offspring = undefined;
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
    },

    createGametes() {
      if (!self.mother && self.father) {
        return;
      }
      self.motherGamete = JSON.stringify(createGamete(self.mother!));
      self.fatherGamete = JSON.stringify(createGamete(self.father!));

      self.offspring = undefined;
    },

    fertilize() {
      if (!self.motherGamete && self.fatherGamete) {
        return;
      }
      const child = fertilize(JSON.parse(self.motherGamete!), JSON.parse(self.fatherGamete!));
      self.offspring = BackpackMouse.create(child);

      self.motherGamete = undefined;
      self.fatherGamete = undefined;
    }
  }));

export type BreedingModelType = Instance<typeof BreedingModel>;
