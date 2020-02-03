import { types, Instance, cast } from "mobx-state-tree";
import { RightPanelTypeEnum } from "../../ui";
import { BackpackMouse, BackpackMouseType } from "../../backpack-mouse";
import { breed, createGamete, fertilize } from "../../../utilities/genetics";
import { ToolbarButton } from "../populations/populations";
import uuid = require("uuid");
import { RightPanelType } from "../../../models/ui";
import { shuffle } from "lodash";

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
  hasBeenVisited: false,
  litters: types.array(types.array(BackpackMouse)),
  shuffledLeftGametePositions: types.array(types.array(types.number)),
  shuffledRightGametePositions: types.array(types.array(types.number))
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
  },
  getData(chartType: BreedingChartType) {
    const data: {[key: string]: number} = {};
    const prop = chartType === "color" ? "baseColor" : chartType;
    self.litters.forEach(litter => {
      litter.forEach(org => {
        const val = org[prop];
        if (!data[val]) data[val] = 0;
        data[val] = data[val] + 1;
      });
    });
    return data;
  },
  getLitterGametes(litterIndex: number) {
    const gametes = { leftMouseGametes: [] as string[], rightMouseGametes: [] as string[] };
    if (self.litters.length && litterIndex < self.litters.length) {
      self.litters[litterIndex].forEach(org => {
        gametes.leftMouseGametes.push(org.genotype.charAt(0));
        gametes.rightMouseGametes.push(org.genotype.charAt(1));
      });
    }
    return gametes;
  },
  getLitterGametePositions(litterIndex: number) {
    const shuffledPositions = { leftMousePositions: [] as number[], rightMousePositions: [] as number[] };
    if ((self.shuffledLeftGametePositions.length && litterIndex < self.shuffledLeftGametePositions.length)
         && (self.shuffledRightGametePositions.length && litterIndex < self.shuffledRightGametePositions.length)) {
      shuffledPositions.leftMousePositions = self.shuffledLeftGametePositions[litterIndex];
      shuffledPositions.rightMousePositions = self.shuffledRightGametePositions[litterIndex];
    }
    return shuffledPositions;
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
      self.hasBeenVisited = true;     // can't be set false
    }
  },
  breedLitter(litterSize: number) {
    const litter: BackpackMouseType[] = [];
    const positions: number[] = [];
    for (let i = 0; i < litterSize; i++) {
      const child = breed(self.mother, self.father);
      litter.push(BackpackMouse.create(child));
      positions.push(i);
    }
    self.litters.push(litter as any);
    const shuffledLeftPositions = shuffle(positions);
    const shuffledRightPositions = shuffle(positions);
    self.shuffledRightGametePositions.push(shuffledLeftPositions as any);
    self.shuffledLeftGametePositions.push(shuffledRightPositions as any);
  },
  clearLitters() {
    self.litters.length = 0;
    self.shuffledRightGametePositions.length = 0;
    self.shuffledLeftGametePositions.length = 0;
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
    userChartType: types.maybe(BreedingChartTypeEnum),
    minLitterSize: 3,
    maxLitterSize: 5,
    enableColorChart: true,
    enableGenotypeChart: true,
    enableSexChart: true,
    enableInspectGametes: true,
    showGametes: false,
  })
  .actions(self => ({

    breedLitter() {
      const nestPair = self.nestPairs.find(pair => pair.id === self.breedingNestPairId);
      if (!nestPair) return;
      const litterSize = self.minLitterSize + Math.floor(Math.random() * (self.maxLitterSize - self.minLitterSize + 1));
      nestPair.breedLitter(litterSize);
    },

    clearLitters() {
      const nestPair = self.nestPairs.find(pair => pair.id === self.breedingNestPairId);
      if (!nestPair) return;
      nestPair.clearLitters();
    },

    setShowSexStack(show: boolean) {
      self.showSexStack = show;
    },

    setShowHeteroStack(show: boolean) {
      self.showHeteroStack = show;
    },

    setShowGametes(show: boolean) {
      self.showGametes = show;
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
      self.rightPanel = "information";   // auto-switch to inspect
    },
    clearInspectedNest() {
      self.inspectedNestPairId = "";
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
        return self.userChartType ? self.userChartType :
          self.enableColorChart ? "color" :
          self.enableGenotypeChart ? "genotype" :
          self.enableSexChart ? "sex" : "color";
      },
    };
  })
  .views((self) => {
    return {
      get activeBreedingPair(): INestPair | undefined {
        return self.nestPairs.find(pair => pair.id === self.breedingNestPairId);
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
          value: self.chartType === "color",
          action: (val: boolean) => {
            self.setChartType("color");
          },
          section: "data",
          disabled: !self.enableColorChart,
        });
        buttons.push({
          title: "Genotypes",
          value: self.chartType === "genotype",
          action: (val: boolean) => {
            self.setChartType("genotype");
          },
          section: "data",
          disabled: !self.enableGenotypeChart,
        });
        buttons.push({
          title: "Sex",
          value: self.chartType === "sex",
          action: (val: boolean) => {
            self.setChartType("sex");
          },
          section: "data",
          disabled: !self.enableSexChart,
        });

        return buttons;
      }
    };
  });

export type BreedingModelType = Instance<typeof BreedingModel>;
