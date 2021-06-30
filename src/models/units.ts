import { types } from "mobx-state-tree";
import { Unit } from "../authoring";
import { LegendItem } from "../components/spaces/breeding/breeding-data";
import { PieChartData } from "../components/charts/pie-chart";
import { BreedingChartType, EnvironmentColorType } from "./spaces/breeding/breeding";
import { BackpackMouseType } from "./backpack-mouse";
// @ts-ignore
import * as colors from "../components/colors.scss";
import { InspectFooterInfoProvider, OrganismInfoProvider, InspectStrings } from "../components/inspect-panel";
import { animalInspectPanelStrings, renderAnimalInfo } from "../components/inspect-panel-info.animal";
import { getPairFooter, plantInspectPanelStrings, renderPlantInfo } from "../components/inspect-panel-info.plant";

export const UnitTypeEnum = types.enumeration("unit", ["mouse", "pea"]);

export interface UnitSpecies {
  alleles: string[];
  getBaseImage: (org: BackpackMouseType) => string;
  getBreedingImage: (parent: BackpackMouseType) => string;
  getNestOutlineImage: (genotype: string) => string;
  getZoomedInParentImage?: (parent: BackpackMouseType) => string;    // if not specified, base image is used
  getOffspringImage?: (parent: BackpackMouseType) => string;         // if not specified, nest image is used
  getInspectOffspringImage?: (org: BackpackMouseType) => string;     // if not specified, base image is used
  getInspectParentImage?: (org: BackpackMouseType) => string;
  getInspectNestImage?: (org: BackpackMouseType) => string;
  getChartImage?: (parent: BackpackMouseType) => string;
  getChartSecondaryImage?: (parent: BackpackMouseType) => string;   // optional image below the label
  getChartEmptyImage: (parent: BackpackMouseType) => string;
  getPhenotype: (genotype: string) => string;
  phenotypeHeading: string;
  getPhenotypeLabel: (phenotype: string) => string;
  getGenotypeHTMLLabel: (genotype: string) => string;
  getGameteHTMLLabel: (allele: string) => string;
  chartTypes: Record<string, {legend: LegendItem[], title: string}>;
  getChartData: (chartType: string, data: Record<string, number>) => PieChartData[];
  showSexStack: boolean;
  offspringCollectionName: string;
  inspectInfoProvider: OrganismInfoProvider;
  inspectFooterProvider?: InspectFooterInfoProvider;
  inspectStrings: InspectStrings;
}

interface BreedingParent {
  genotype: string;
  label?: string;
}

interface BreedingPair {
  parents: BreedingParent[];
  label: string;
  chartLabel?: string;
  meta?: string;                          // is used by breed button, may be expanded
}

interface UnitDefinition {
  title: string;
  species: UnitSpecies;
  populations: {
    title: string;
  };
  organism: {
    title: string;
  };
  breeding: {
    nestingTitle: string;
    breedingTitle: string;
    breedingPairs: BreedingPair[];
    availableChartTypes: BreedingChartType[];
    parentSize: number;
    offspringSize: number;
    nestParentSize: number;
    flipRightNestParent: boolean;
    showMaleOnLeft: boolean;
    inspectPairsPaneTitle: string;
    inspectParentPaneTitle?: string;        // if not specified we generate based on pair's chartLabel and parent sex
    inspectOffspringPaneTitle?: string;     // if not specified we generate based on pair's chartLabel and litter number
    nestButtonTitle: string;
    showGenotypeUnderChartImage: boolean;
    getNestBackgroundImage: (backgroundType: EnvironmentColorType) => string;
    getNestHoverImage?: (nest: number) => string;
  };
  dna: {
    title: string;
  };
}

type Units = Record<Unit, UnitDefinition>;

// species image functions, which are used in different confgurations by the species defs
const curledMouseImage = (org: BackpackMouseType) => {
  switch (org.genotype) {
    case "RR":
      return "assets/unit/mouse/mouse_field.png";
    case "CC":
      return "assets/unit/mouse/mouse_beach.png";
    default:
      return "assets/unit/mouse/mouse_tan.png";
  }
};
const longTailedMouseImage = (org: BackpackMouseType) => {
  switch (org.genotype) {
    case "RR":
      return "assets/unit/mouse/mouse_field_nest.png";
    case "CC":
      return "assets/unit/mouse/mouse_beach_nest.png";
    default:
      return "assets/unit/mouse/mouse_tan_nest.png";
  }
};
const peaImage = (org: BackpackMouseType) => {
  switch (org.genotype) {
    case "rr":
      return "assets/unit/pea/pea_wrinkled.png";
    default:
      return "assets/unit/pea/pea_round.png";
  }
};
const flowerPotImage = (org: BackpackMouseType) => {
  switch (org.label) {
    case "Plant 1":
      return "assets/unit/pea/plant_1.png";
    case "Plant 2":
      return "assets/unit/pea/plant_2.png";
    case "Plant 3":
    default:
      return "assets/unit/pea/plant_3.png";
  }
};
const flowerPotZoomImage = (org: BackpackMouseType) => {
  const lowerSnakeLabel = org.label.toLowerCase().replace(" ", "_");
  // e.g. "assets/unit/pea/plant_1_female_zoom.png"
  return `assets/unit/pea/${lowerSnakeLabel}_${org.sex}_zoom.png`;
};

export const units: Units = {
  mouse: {
    title: "Deer Mice",
    species: {
      alleles: ["R", "C"],
      getBaseImage: curledMouseImage,
      getBreedingImage: longTailedMouseImage,
      getNestOutlineImage: () => "assets/unit/mouse/breeding/nesting/nest_mouse_outline.png",
      getChartEmptyImage: () => "assets/mouse_collect.png",
      getPhenotype: (genotype) => {
        switch (genotype) {
          case "RR":
            return "brown";
          case "CC":
            return "white";
          default:
            return "tan";
        }
      },
      phenotypeHeading: "Fur Colors",
      getPhenotypeLabel: (phenotype) => {
        switch (phenotype) {
          case "white":
            return "Light brown";
          case "tan":
            return "Medium brown";
          default:
            return "Dark brown";
        }
      },
      getGenotypeHTMLLabel: (genotype) => {
        switch (genotype) {
          case "CC":
            return "R<sup>L</sup>R<sup>L</sup>";
          case "RR":
            return "R<sup>D</sup>R<sup>D</sup>";
          case "RC":
            return "R<sup>D</sup>R<sup>L</sup>";
          case "CR":
            return "R<sup>L</sup>R<sup>D</sup>";
          default:
            return "";
        }
      },
      getGameteHTMLLabel: (allele) => {
        switch (allele) {
          case "C":
            return "R<sup>L</sup>";
          case "R":
            return "R<sup>D</sup>";
          default:
            return "";
        }
      },
      chartTypes: {
        phenotype: {legend: [
          {label: "Light Brown", color: colors.colorDataMouseBrownLightRep},
          {label: "Medium Brown", color: colors.colorDataMouseBrownMediumRep},
          {label: "Dark Brown", color: colors.colorDataMouseBrownDarkRep}
        ], title: "Fur Colors" },
        genotype: {legend: [
          {label: "R<sup>L</sup>R<sup>L</sup> Mice", color: colors.colorDataMouseBrownLightRep},
          {label: "R<sup>L</sup>R<sup>D</sup> Mice", color: colors.colorDataMouseBrownMediumRep},
          {label: "R<sup>D</sup>R<sup>L</sup> Mice", color: colors.colorDataMouseBrownMediumRep},
          {label: "R<sup>D</sup>R<sup>D</sup> Mice", color: colors.colorDataMouseBrownDarkRep}
        ], title: "Genotypes" },
        sex: {legend: [
          {label: "Female", color: colors.colorChartYellow},
          {label: "Male", color: colors.colorChartRed}
        ], title: "Sex" }
      },
      getChartData: (chartType, data) => {
        let pieData = [];
        if (chartType === "genotype") {
          pieData = [{label: "RᴸRᴸ", value: data.CC, color: colors.colorDataMouseBrownLightRep},
                     {label: "RᴸRᴰ", value: data.CR, color: colors.colorDataMouseBrownMediumRep},
                     {label: "RᴰRᴸ", value: data.RC, color: colors.colorDataMouseBrownMediumRep},
                     {label: "RᴰRᴰ", value: data.RR, color: colors.colorDataMouseBrownDarkRep}];
        } else if (chartType === "sex") {
          pieData = [{label: "Female", value: data.female, color: colors.colorChartYellow},
                     {label: "Male", value: data.male, color: colors.colorChartRed}];
        } else {
          pieData = [{label: "Light", value: data.white, color: colors.colorDataMouseBrownLightRep},
                     {label: "Medium", value: data.tan, color: colors.colorDataMouseBrownMediumRep},
                     {label: "Dark", value: data.brown, color: colors.colorDataMouseBrownDarkRep}];
        }
        return pieData;
      },
      showSexStack: true,
      offspringCollectionName: "Litter",
      inspectInfoProvider: renderAnimalInfo,
      inspectStrings: animalInspectPanelStrings,
    },
    populations: {
      title: "Explore: Population",
    },
    organism: {
      title: "Explore: Organism",
    },
    breeding: {
      nestingTitle: "Explore: Nesting Pairs",
      breedingTitle: "Explore: Nesting Pairs",
      breedingPairs: [
        {parents: [{genotype: "RC"}, {genotype: "RR"}], label: "Pair 1"},
        {parents: [{genotype: "CC"}, {genotype: "RR"}], label: "Pair 2"},
        {parents: [{genotype: "CC"}, {genotype: "CC"}], label: "Pair 3"},
        {parents: [{genotype: "RR"}, {genotype: "RR"}], label: "Pair 4"},
        {parents: [{genotype: "RC"}, {genotype: "RC"}], label: "Pair 5"},
        {parents: [{genotype: "CC"}, {genotype: "RC"}], label: "Pair 6"}
      ],
      availableChartTypes: ["genotype", "phenotype", "sex"],
      parentSize: 90,
      offspringSize: 60,
      nestParentSize: 80,
      flipRightNestParent: true,
      showMaleOnLeft: false,
      inspectPairsPaneTitle: "Nesting Pairs",
      nestButtonTitle: "Nesting",
      showGenotypeUnderChartImage: false,
      getNestBackgroundImage: (backgroundType) => {
        switch (backgroundType) {
          case "brown":
            return "assets/unit/mouse/breeding/nesting/environment-brown-nests.png";
          case "white":
            return "assets/unit/mouse/breeding/nesting/environment-white-nests.png";
          default:
            return "assets/unit/mouse/breeding/nesting/environment-mixed-nests.png";
        }
      },
      getNestHoverImage: (nest) => {
        switch (nest) {
          case 1:
            return "assets/unit/mouse/breeding/nesting/left-top-hover.png";
          case 2:
            return "assets/unit/mouse/breeding/nesting/right-top-hover.png";
          case 3:
            return "assets/unit/mouse/breeding/nesting/left-middle-hover.png";
          case 4:
            return "assets/unit/mouse/breeding/nesting/right-middle-hover.png";
          case 5:
            return "assets/unit/mouse/breeding/nesting/left-bottom-hover.png";
          case 6:
            return "assets/unit/mouse/breeding/nesting/right-bottom-hover.png";
          default:
            return "";
        }
      }
    },
    dna: {
      title: "Explore: DNA",
    },
  },
  pea: {
    title: "Peas",
    species: {
        alleles: ["R", "r"],
        getBaseImage: peaImage,
        getBreedingImage: flowerPotImage,
        getNestOutlineImage: () => "",
        getZoomedInParentImage: (parent) => parent.sex === "female" ?
          "assets/unit/pea/flower_female.png" :
          "assets/unit/pea/flower_male.png",
        getOffspringImage: peaImage,
        getInspectParentImage: flowerPotZoomImage,
        getInspectNestImage: flowerPotImage,
        getChartImage: flowerPotImage,
        getChartSecondaryImage: peaImage,
        getChartEmptyImage: (parent) => {
          switch (parent.label) {
            case "Plant 1":
              return "assets/unit/pea/plant_1_outline.png";
            case "Plant 2":
              return "assets/unit/pea/plant_2_outline.png";
            case "Plant 3":
            default:
              return "assets/unit/pea/plant_3_outline.png";
          }
        },
        getPhenotype: (genotype) => {
          switch (genotype) {
            case "rr":
              return "wrinkled";
            default:
              return "round";
          }
        },
        phenotypeHeading: "Pea shape",
        getPhenotypeLabel: (phenotype) => phenotype.charAt(0).toUpperCase() + phenotype.slice(1),
        getGenotypeHTMLLabel: (genotype) => genotype.charAt(1) + genotype.charAt(0),
        getGameteHTMLLabel: (allele) => allele,
        chartTypes: {
          phenotype: {legend: [
            {label: "Round", color: colors.colorDataPeaRound},
            {label: "Wrinkled", color: colors.colorDataPeaWrinkled}
          ], title: "Pea Shape" },
          genotype: {legend: [
            {label: "RR Peas", color: colors.colorDataPeaDark},
            {label: "Rr Peas", color: colors.colorDataPeaRound},
            {label: "rR Peas", color: colors.colorDataPeaRound},
            {label: "rr Peas", color: colors.colorDataPeaWrinkled}
          ], title: "Genotypes" }
        },
        getChartData: (chartType, data) => {
          let pieData = [];
          if (chartType === "genotype") {
            pieData = [{label: "RR", value: data.RR, color: colors.colorDataPeaDark},
                       {label: "Rr", value: data.rR, color: colors.colorDataPeaRound},
                       {label: "rR", value: data.Rr, color: colors.colorDataPeaRound},
                       {label: "rr", value: data.rr, color: colors.colorDataPeaWrinkled}];
          } else {
            pieData = [{label: "Round", value: data.round, color: colors.colorDataPeaRound},
                       {label: "Wrinkled", value: data.wrinkled, color: colors.colorDataPeaWrinkled}];
          }
          return pieData;
        },
        showSexStack: false,
        offspringCollectionName: "Pod",
        inspectInfoProvider: renderPlantInfo,
        inspectFooterProvider: getPairFooter,
        inspectStrings: plantInspectPanelStrings,
      },
    populations: {
      title: "Explore: Population",
    },
    organism: {
      title: "Explore: Organism",
    },
    breeding: {
      nestingTitle: "Explore: Greenhouse Experiments",
      breedingTitle: "Explore: Breeding",
      breedingPairs: [
        {
          parents: [
            {genotype: "rR", label: "Plant 1"},
            {genotype: "rR", label: "Plant 1"}
          ],
          label: "Experiment A",
          chartLabel: "Exp. A",
          meta: "self-fertilization",
        },
        {
          parents: [
            {genotype: "rR", label: "Plant 1"},
            {genotype: "RR", label: "Plant 2"}
          ],
          label: "Experiment B",
          chartLabel: "Exp. B",
        },
        {
          parents: [
            {genotype: "RR", label: "Plant 2"},
            {genotype: "RR", label: "Plant 2"}
          ],
          label: "Experiment C",
          chartLabel: "Exp. C",
          meta: "self-fertilization",
        },
        {
          parents: [
            {genotype: "RR", label: "Plant 2"},
            {genotype: "rr", label: "Plant 3"}
          ],
          label: "Experiment D",
          chartLabel: "Exp. D",
        },
        {
          parents: [
            {genotype: "rr", label: "Plant 3"},
            {genotype: "rr", label: "Plant 3"}
          ],
          label: "Experiment E",
          chartLabel: "Exp. E",
          meta: "self-fertilization",
        },
        {
          parents: [
            {genotype: "rr", label: "Plant 3"},
            {genotype: "rR", label: "Plant 1"}
          ],
          label: "Experiment F",
          chartLabel: "Exp. F",
        }
      ],
      parentSize: 94,
      availableChartTypes: ["genotype", "phenotype"],
      offspringSize: 51,
      nestParentSize: 118,
      flipRightNestParent: false,
      showMaleOnLeft: true,
      inspectPairsPaneTitle: "Experiment",
      inspectParentPaneTitle: "Flower",
      inspectOffspringPaneTitle: "Offspring",
      nestButtonTitle: "Greenhouse",
      showGenotypeUnderChartImage: true,
      getNestBackgroundImage: () => "assets/unit/pea/environment_greenhouse_with_shelves.png",
    },
    dna: {
      title: "Explore: DNA",
    },
  }
};

export const speciesDef = (unit: Unit) => units[unit].species;
