import { types, Instance } from "mobx-state-tree";
import { RightPanelTypeEnum } from "../../ui";
import { BackpackMouse, BackpackMouseType } from "../../backpack-mouse";
import { breed, createGamete, fertilize } from "../../../utilities/genetics";
import { ToolbarButton } from "../populations/populations";
import uuid = require("uuid");

export const BreedingTypeEnum = types.enumeration("type", ["litter", "singleGamete"]);
export type BreedingType = typeof BreedingTypeEnum.Type;

const BreedingInteractionModeEnum = types.enumeration("interaction", ["none", "breed", "select", "inspect"]);
export type BreedingInteractionModeType = typeof BreedingInteractionModeEnum.Type;

const NestPair = types.model({
  id: types.optional(types.identifier, () => uuid()),
  leftMouse: BackpackMouse,
  rightMouse: BackpackMouse,
  leftMouseBackpackId: types.maybe(types.string),
  rightMouseBackpackId: types.maybe(types.string),
  label: types.string
})
.actions(self => ({
  setLeftMouseBackpackId(id: string) {
    self.leftMouseBackpackId = id;
  },
  setRightMouseBackpackId(id: string) {
    self.rightMouseBackpackId = id;
  },
}));
export type INestPair = Instance<typeof NestPair>;

export function createBreedingModel(breedingProps: any) {
  breedingProps.nestPairs = [
    {leftMouse: {sex: "male", genotype: "RC"}, rightMouse: {sex: "female", genotype: "RR"}, label: "Pair 1"},
    {leftMouse: {sex: "male", genotype: "CC"}, rightMouse: {sex: "female", genotype: "RR"}, label: "Pair 2"},
    {leftMouse: {sex: "male", genotype: "CC"}, rightMouse: {sex: "female", genotype: "CC"}, label: "Pair 3"},
    {leftMouse: {sex: "male", genotype: "RR"}, rightMouse: {sex: "female", genotype: "RR"}, label: "Pair 4"},
    {leftMouse: {sex: "male", genotype: "RC"}, rightMouse: {sex: "female", genotype: "RC"}, label: "Pair 5"},
    {leftMouse: {sex: "male", genotype: "CC"}, rightMouse: {sex: "female", genotype: "RC"}, label: "Pair 6"},
  ];
  return BreedingModel.create(breedingProps);
}

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
    instructions: "",
    showSexStack: false,
    showHeteroStack: false,
    interactionMode: types.optional(BreedingInteractionModeEnum, "breed"),
    nestPairs: types.array(NestPair),
    inspectedNestPairId: types.maybe(types.string)
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
    },

    setShowSexStack(show: boolean) {
      self.showSexStack = show;
    },

    setShowHeteroStack(show: boolean) {
      self.showHeteroStack = show;
    },

    toggleInteractionMode(mode: "select" | "inspect" | "breed") {
      if (self.interactionMode === mode) {
        self.interactionMode = "none";
      } else {
        self.interactionMode = mode;
      }
    },

    setNestPairLeftMouseBackpackId(nestPairId: string, backpackId: string) {
      const nestPair = self.nestPairs.find(pair => pair.id === nestPairId);
      if (nestPair) {
        nestPair.setLeftMouseBackpackId(backpackId);
      }
    },
    setNestPairRightMouseBackpackId(nestPairId: string, backpackId: string) {
      const nestPair = self.nestPairs.find(pair => pair.id === nestPairId);
      if (nestPair) {
        nestPair.setRightMouseBackpackId(backpackId);
      }
    },

    setInspectedNest(nestPairId: string) {
      self.inspectedNestPairId = nestPairId;
    },
  }))
  .views((self) => {
    return {
      get toolbarButtons(): ToolbarButton[] {
        const buttons = [];
        buttons.push({
          title: "Females",
          imageClass: "circle female",
          secondaryTitle: "Males",
          secondaryTitleImageClass: "circle male",
          type: "checkbox",
          value: self.showSexStack,
          action: (val: boolean) => {
            self.setShowSexStack(val);
          }
        });

        buttons.push({
          title: "Heterozygotes",
          imageClass: "circle heterozygote",
          type: "checkbox",
          value: self.showHeteroStack,
          action: (val: boolean) => {
            self.setShowHeteroStack(val);
          }
        });
        return buttons;
      },
    };
  });

export type BreedingModelType = Instance<typeof BreedingModel>;
