import { types, Instance } from "mobx-state-tree";
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
  currentBreeding: false, // TODO: might be replaced based on breeding changes
  hasBred: false, // TODO: might be replaced based on breeding changes
  numOffspring: 0 // TODO: replace by requesting size of offspring data structure
})
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
    userChartType: types.optional(BreedingChartTypeEnum, "color")
  })
  .actions(self => ({

    breedLitter() {
      // nothing yet
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
