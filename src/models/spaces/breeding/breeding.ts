import { types, Instance, cast } from "mobx-state-tree";
import { RightPanelTypeEnum } from "../../ui";
import { BackpackMouse, BackpackMouseType } from "../../backpack-mouse";
import { breed, createGamete, fertilize } from "../../../utilities/genetics";
import { ToolbarButton } from "../populations/populations";
import uuid = require("uuid");
import { RightPanelType } from "../../../models/ui";
import { shuffle } from "lodash";

const BreedingInteractionModeEnum = types.enumeration("interaction", ["none", "breed", "select", "inspect", "gametes"]);
export type BreedingInteractionModeType = typeof BreedingInteractionModeEnum.Type;

export const EnvironmentColorTypeEnum = types.enumeration("environment", ["white", "neutral", "brown"]);
export type EnvironmentColorType = typeof EnvironmentColorTypeEnum.Type;

const BreedingChartTypeEnum = types.enumeration("chart", ["color", "genotype", "sex"]);
export type BreedingChartType = typeof BreedingChartTypeEnum.Type;

const ShuffledGametePositions = types.model({
  leftMouse: types.array(types.number),
  rightMouse: types.array(types.number),
})
.actions(self => ({
  setPositions(leftPositions: any, rightPositions: any) {
    self.leftMouse = leftPositions;
    self.rightMouse = rightPositions;
  }
}));
export type IShuffledGametePositions = Instance<typeof ShuffledGametePositions>;
const MAX_VERBOSE_LITTERS = 20;
interface LitterMeta {
  litters: number;
  CC: number;
  CR: number;
  RC: number;
  RR: number;
}

const BreedingInspectTypeEnum = types.enumeration("inspect", ["none", "nest", "organism", "gamete"]);
export type BreedingInspectType = typeof BreedingInspectTypeEnum.Type;

const InspectInfo = types.model({
  type: types.optional(BreedingInspectTypeEnum, "none"),
  nestPairId: types.string,
  litterIndex: types.number,
  isParent: types.boolean,
  organismId: types.string,
})
.views((self) => ({
}))
.actions(self => ({
  setInspectedNestPair(id: string) {
    self.type = "nest";
    self.nestPairId = id;
    self.organismId = "";
  },
  setInspectedMouse(pairId: string, litterIndex: number, organismId: string, isParent: boolean) {
    self.type = "organism";
    self.nestPairId = pairId;
    self.litterIndex = litterIndex;
    self.organismId = organismId;
    self.isParent = isParent;
  },
  setInspectedGamete(pairId: string, litterIndex: number, id: string, isParent: boolean) {
    self.type = "gamete";
    self.nestPairId = pairId;
    self.litterIndex = litterIndex;
    self.organismId = id;
    self.isParent = isParent;
  },
  clearInspection() {
    self.type = "none";
  },
}));

export const NestPair = types.model({
  id: types.optional(types.identifier, () => uuid()),
  leftMouse: BackpackMouse,
  rightMouse: BackpackMouse,
  label: types.string,
  currentBreeding: false,
  hasBeenVisited: false,
  litters: types.array(types.array(BackpackMouse)),
  litterShuffledGametePositions: types.array(ShuffledGametePositions),
  condensedLitterMeta: types.maybe(types.string),
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
  getLitterShuffledGametePositions(litterIndex: number) {
    if (self.litterShuffledGametePositions.length && litterIndex < self.litterShuffledGametePositions.length) {
      return self.litterShuffledGametePositions[litterIndex];
    }
    return { leftMouse: [] as number[], rightMouse: [] as number[] };
  }
}))
.actions(self => ({
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
    const shuffledPositions = ShuffledGametePositions.create();
    shuffledPositions.setPositions(shuffle(positions), shuffle(positions));
    self.litterShuffledGametePositions.push(shuffledPositions);
  },
  clearLitters() {
    self.litters.length = 0;
    self.litterShuffledGametePositions.length = 0;
  }
}))
.postProcessSnapshot(snapshot => {
  if (snapshot.litters.length > MAX_VERBOSE_LITTERS) {
    // remove raw litter data and save condensed meatadata version instead
    const meta: LitterMeta = {
      litters: snapshot.litters.length,
      CC: 0,
      CR: 0,
      RC: 0,
      RR: 0
    };
    snapshot.litters.forEach(litter => {
      litter.forEach(org => {
        meta[org.genotype]++;
      });
    });
    snapshot.condensedLitterMeta = JSON.stringify(meta);
    delete snapshot.litters;
    delete snapshot.litterShuffledGametePositions;
  } else {
    delete snapshot.condensedLitterMeta;
  }
  return snapshot;
})
.actions(self => ({
  afterCreate() {
    if (self.condensedLitterMeta) {
      // ** create new set of litters, given the metadata saved **
      const meta = JSON.parse(self.condensedLitterMeta) as LitterMeta;

      // create random array of genotypes, with correct numbers;
      const totalOffspring = meta.CC + meta.CR + meta.RC + meta.RR;
      let  genotypes = new Array(totalOffspring);
      genotypes.fill("CC", 0, meta.CC);
      genotypes.fill("CR", meta.CC, meta.CC + meta.CR);
      genotypes.fill("RC", meta.CC + meta.CR, meta.CC + meta.CR + meta.RC);
      genotypes.fill("RR", meta.CC + meta.CR + meta.RC, totalOffspring);
      genotypes = shuffle(genotypes);

      // create random array of litter sizes, each 3-5, adding up to corect number of offspring
      let litterSizes: number[] = new Array(meta.litters).fill(3);
      let littersOfFour = totalOffspring - (meta.litters * 3);
      const littersOfFive = totalOffspring - (meta.litters * 4) > 0 ?
        totalOffspring - (meta.litters * 4) : Math.round(Math.random() * (littersOfFour / 2));
      littersOfFour -= littersOfFive * 2;
      litterSizes.fill(5, 0, littersOfFive);
      litterSizes.fill(4, littersOfFive, littersOfFive + littersOfFour);
      litterSizes = shuffle(litterSizes);

      // create offspring
      let currOffspring = 0;
      for (let i = 0; i < meta.litters; i++) {
        const litter: BackpackMouseType[] = [];
        for (let j = 0; j < litterSizes[i]; j++) {
          litter.push(BackpackMouse.create({
            sex: Math.random() < 0.5 ? "female" : "male",
            genotype: genotypes[currOffspring]
          }));
          currOffspring++;
        }
        self.litters.push(litter as any);

        const shuffledPositions = ShuffledGametePositions.create();
        const indices = Array.from(Array(litterSizes[i]).keys());   // [0, 1, ... n]
        shuffledPositions.setPositions(shuffle(indices), shuffle(indices));
        self.litterShuffledGametePositions.push(shuffledPositions);
      }
    }
  }
}));

export type INestPair = Instance<typeof NestPair>;

export function createBreedingModel(breedingProps: any) {
  if (!breedingProps.backgroundType) {
    const rand = Math.random();
    breedingProps.backgroundType = rand > .66 ? "neutral" : (rand > .33 ? "brown" : "white");
  }
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
  if (breedingProps.nestPairs && breedingProps.nestPairs.some((pair: INestPair) => pair.hasBeenVisited)) {
    breedingProps.rightPanel = "data";
  }
  breedingProps.inspectInfo = InspectInfo.create({nestPairId: "", organismId: "", litterIndex: 0, isParent: false, });
  return BreedingModel.create(breedingProps);
}

export const BreedingModel = types
  .model("Breeding", {
    rightPanel: types.optional(RightPanelTypeEnum, "instructions"),
    instructions: "",
    showSexStack: false,
    showHeteroStack: false,
    interactionMode: types.optional(BreedingInteractionModeEnum, "breed"),
    backgroundType: types.optional(EnvironmentColorTypeEnum, "neutral"),
    nestPairs: types.array(NestPair),
    inspectInfo: InspectInfo,
    breedingNestPairId: types.maybe(types.string),
    userChartType: types.maybe(BreedingChartTypeEnum),
    minLitterSize: 3,
    maxLitterSize: 5,
    enableColorChart: true,
    enableGenotypeChart: true,
    enableSexChart: true,
    enableInspectGametes: true,
  })
  .actions(self => ({

    breedLitter() {
      const nestPair = self.nestPairs.find(pair => pair.id === self.breedingNestPairId);
      if (!nestPair) return;
      const litterSize = self.minLitterSize + Math.floor(Math.random() * (self.maxLitterSize - self.minLitterSize + 1));
      nestPair.breedLitter(litterSize);
      self.rightPanel = "data";
    },

    clearLitters() {
      const nestPair = self.nestPairs.find(pair => pair.id === self.breedingNestPairId);
      if (!nestPair) return;
      nestPair.clearLitters();
      // if we're inspecting a litter mouse, clear inspection
      if ((self.inspectInfo.type === "gamete" || self.inspectInfo.type === "organism")
          && self.inspectInfo.nestPairId === self.breedingNestPairId
          && !self.inspectInfo.isParent) {
        self.inspectInfo.litterIndex = -1;
        self.inspectInfo.type = "none";
      }
    },

    setShowSexStack(show: boolean) {
      self.showSexStack = show;
    },

    setShowHeteroStack(show: boolean) {
      self.showHeteroStack = show;
    },

    toggleInteractionMode(mode: "select" | "inspect" | "breed" | "gametes") {
      if (self.interactionMode === mode) {
        self.interactionMode = "none";
      } else {
        self.interactionMode = mode;
      }
    },
    clearNestPairActiveBreeding() {
      self.nestPairs.forEach(pair => {
        pair.setCurrentBreeding(false);
      });
      self.breedingNestPairId = undefined;
      self.interactionMode = "breed";
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
    setInspectedMouse(mouseId: string, pairId: string, litterIndex: number, isParent: boolean) {
      self.inspectInfo.setInspectedMouse(pairId, litterIndex, mouseId, isParent);
      self.rightPanel = "information";   // auto-switch to inspect
    },
    setInspectedGamete(mouseId: string, pairId: string, litterIndex: number, isParent: boolean) {
      self.inspectInfo.setInspectedGamete(pairId, litterIndex, mouseId, isParent);
      self.rightPanel = "information";   // auto-switch to inspect
    },
    setInspectedNest(pairId: string) {
      self.inspectInfo.setInspectedNestPair(pairId);
      self.rightPanel = "information";   // auto-switch to inspect
    },
    clearInspectedNest() {
      self.inspectInfo.clearInspection();
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
      get backgroundImage() {
        switch (self.backgroundType) {
          case "brown":
            return "assets/curriculum/mouse/breeding/nesting/environment-brown-nests.png";
          case "white":
            return "assets/curriculum/mouse/breeding/nesting/environment-white-nests.png";
          default:
            return "assets/curriculum/mouse/breeding/nesting/environment-mixed-nests.png";
        }
      },
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
