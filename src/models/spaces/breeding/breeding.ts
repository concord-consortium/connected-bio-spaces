import { types, Instance, cast } from "mobx-state-tree";
import { RightPanelTypeEnum } from "../../ui";
import { BackpackMouse, BackpackMouseType } from "../../backpack-mouse";
import { breed, createGamete, fertilize } from "../../../utilities/genetics";
import { ToolbarButton } from "../populations/populations";
import uuid = require("uuid");
import { RightPanelType } from "../../../models/ui";

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
  currentBreeding: false,
  hasBred: false, // TODO: might be replaced based on breeding changes
  litters: types.array(types.array(BackpackMouse))
})
.views((self) => ({
  get mother() {
    return self.leftMouse.sex === "female" ? self.leftMouse : self.rightMouse;
  },
  get father() {
    return self.leftMouse.sex === "male" ? self.leftMouse : self.rightMouse;
  },
  get numOffspring() {
    return self.litters.reduce((size, litter) => litter.length + size, 0);
  }
}))
.actions(self => ({
  setLeftMouseBackpackId(id: string) {
    self.leftMouseBackpackId = id;
  },
  setRightMouseBackpackId(id: string) {
    self.rightMouseBackpackId = id;
  },
  setCurrentBreeding(val: boolean) {
    self.currentBreeding = val;
    if (val) {
      self.hasBred = true;    // can't be unset
    }
  },
  breedLitter(litterSize: number) {
    const litter: BackpackMouseType[] = [];
    for (let i = 0; i < litterSize; i++) {
      const child = breed(self.mother, self.father);
      litter.push(BackpackMouse.create(child));
    }
    self.litters.push(litter as any);
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
    rightPanel: types.optional(RightPanelTypeEnum, "instructions"),
    instructions: "",
    showSexStack: false,
    showHeteroStack: false,
    interactionMode: types.optional(BreedingInteractionModeEnum, "breed"),
    nestPairs: types.array(NestPair),
    inspectedNestPairId: types.maybe(types.string),
    breedingNestPairId: types.maybe(types.string),
    userChartType: types.optional(BreedingChartTypeEnum, "color"),
    minLitterSize: 3,
    maxLitterSize: 5
  })
  .actions(self => ({

    breedLitter() {
      const nestPair = self.nestPairs.find(pair => pair.id === self.breedingNestPairId);
      if (!nestPair) return;
      const litterSize = self.minLitterSize + Math.floor(Math.random() * (self.maxLitterSize - self.minLitterSize + 1));
      nestPair.breedLitter(litterSize);
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
    clearNestPairActiveBreeding() {
      self.nestPairs.forEach(pair => {
        pair.setCurrentBreeding(false);
      });
      self.breedingNestPairId = undefined;
    },
    setNestPairCurrentBreeding(nestPairId: string) {
      const nestPair = self.nestPairs.find(pair => pair.id === nestPairId);
      if (nestPair) {
        self.breedingNestPairId = nestPairId;
        self.nestPairs.forEach(pair => {
          pair.setCurrentBreeding(false);
        });
        nestPair.setCurrentBreeding(true);
        self.rightPanel = "data";   // auto-switch to data when we go to breeding
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
      get activeBreedingPair(): INestPair | undefined {
        return self.nestPairs.find(pair => pair.id === self.breedingNestPairId);
      },
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
