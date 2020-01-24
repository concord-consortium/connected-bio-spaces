import { types, Instance } from "mobx-state-tree";
import { RightPanelTypeEnum } from "../../ui";
import { BackpackMouse, BackpackMouseType } from "../../backpack-mouse";
import { breed, createGamete, fertilize } from "../../../utilities/genetics";
import { ToolbarButton } from "../populations/populations";
import uuid = require("uuid");
import { RightPanelType } from "../../../models/ui";
export const BreedingTypeEnum = types.enumeration("type", ["litter", "singleGamete"]);
export type BreedingType = typeof BreedingTypeEnum.Type;

const BreedingInteractionModeEnum = types.enumeration("interaction", ["none", "breed", "select", "inspect"]);
export type BreedingInteractionModeType = typeof BreedingInteractionModeEnum.Type;

const BreedingChartTypeEnum = types.enumeration("chart", ["color", "genotype", "sex"]);
export type BreedingChartType = typeof BreedingChartTypeEnum.Type;

const NestPair = types.model({
  id: types.optional(types.identifier, () => uuid()),
  leftMouse: BackpackMouse,
  rightMouse: BackpackMouse,
  leftMouseBackpackId: types.maybe(types.string),
  rightMouseBackpackId: types.maybe(types.string),
  label: types.string,
  currentBreeding: false, // TODO: might be replaced based on breeding changes
  activeBreeding: false, // TODO: might be replaced based on breeding changes
  numOffspring: 0 // TODO: replace by requesting size of offspring data structure
})
.actions(self => ({
  setLeftMouseBackpackId(id: string) {
    self.leftMouseBackpackId = id;
  },
  setRightMouseBackpackId(id: string) {
    self.rightMouseBackpackId = id;
  },
  setActiveBreeding(val: boolean) {
    self.activeBreeding = val;
  },
  setCurrentBreeding(val: boolean) {
    self.currentBreeding = val;
  }
}));
export type INestPair = Instance<typeof NestPair>;

export function createBreedingModel(breedingProps: any) {
  if (!breedingProps.nestPairs || breedingProps.nestPairs.length === 0) {
    const breedingPairs = [
      ["RC", "RR"],
      ["CC", "RR"],
      ["CC", "CC"],
      ["RR", "RR"],
      ["RC", "RC"],
      ["CC", "RC"]
    ];
    breedingProps.nestPairs = breedingPairs.map((pair, i) => {
      const leftSex = Math.random() < 0.5 ? "female" : "male";
      const rightSex = leftSex === "female" ? "male" : "female";
      return {
        leftMouse: {sex: leftSex, genotype: pair[0]},
        rightMouse: {sex: rightSex, genotype: pair[1]},
        label: `Pair ${i + 1}`
      };
    });
  }
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
    inspectedNestPairId: types.maybe(types.string),
    userChartType: types.optional(BreedingChartTypeEnum, "color")
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
    toggleNestPairActiveBreeding(nestPairId: string) {
      const nestPair = self.nestPairs.find(pair => pair.id === nestPairId);
      if (nestPair) {
        nestPair.setActiveBreeding(!nestPair.activeBreeding);
      }
    },
    setNestPairCurrentBreeding(nestPairId: string, val: boolean) {
      const nestPair = self.nestPairs.find(pair => pair.id === nestPairId);
      if (nestPair) {
        val && self.nestPairs.forEach(pair => {
          pair.setCurrentBreeding(false);
        });
        nestPair.setCurrentBreeding(val);
      }
    },

    setInspectedNest(nestPairId: string) {
      self.inspectedNestPairId = nestPairId;
    },
    setRightPanel(val: RightPanelType) {
      self.rightPanel = val;
    },
    setChartType(type: BreedingChartType) {
      self.userChartType = type;
    },

  }))
  .views((self) => {
    return {
      get chartType(): BreedingChartType {
        return self.userChartType ? self.userChartType : "color";
      },
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
      get graphButtons(): ToolbarButton[] {
        const buttons = [];
        buttons.push({
          title: "Fur Colors",
          value: self.userChartType === "color",
          action: (val: boolean) => {
            self.setChartType("color");
          },
          section: "data",
        });
        buttons.push({
          title: "Genotypes",
          value: self.userChartType === "genotype",
          action: (val: boolean) => {
            self.setChartType("genotype");
          },
          section: "data",
        });
        buttons.push({
          title: "Sex",
          value: self.userChartType === "sex",
          action: (val: boolean) => {
            self.setChartType("sex");
          },
          section: "data",
        });

        return buttons;
      }
    };
  });

export type BreedingModelType = Instance<typeof BreedingModel>;
