import { types } from "mobx-state-tree";
import { Unit } from "../authoring";
import { LegendItem } from "../components/spaces/breeding/breeding-data";
import { PieChartData } from "../components/charts/pie-chart";
// @ts-ignore
import * as colors from "../components/colors.scss";
import { BreedingChartType } from "./spaces/breeding/breeding";

export const UnitTypeEnum = types.enumeration("unit", ["mouse", "pea"]);

export interface UnitSpecies {
  alleles: string[];
  breedingPairs: string[][];
  getBaseImage: (genotype: string) => string;
  getBreedingImage: (genotype: string) => string;
  getPhenotype: (genotype: string) => string;
  phenotypeHeading: string;
  getPhenotypeLabel: (phenotype: string) => string;
  getGenotypeHTMLLabel: (genotype: string) => string;
  chartTypes: Record<string, {legend: LegendItem[], title: string}>;
  getChartData: (chartType: string, data: Record<string, number>) => PieChartData[];
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
    title: string;
    availableChartTypes: BreedingChartType[];
    offspringSize: number;
  };
  dna: {
    title: string;
  };
}

type Units = Record<Unit, UnitDefinition>;

export const units: Units = {
  mouse: {
    title: "Deer Mice",
    species: {
      alleles: ["R", "C"],
      breedingPairs: [
        ["RC", "RR"],
        ["CC", "RR"],
        ["CC", "CC"],
        ["RR", "RR"],
        ["RC", "RC"],
        ["CC", "RC"]
      ],
      getBaseImage: (genotype) => {
        switch (genotype) {
          case "RR":
            return "assets/unit/mouse/mouse_field.png";
          case "CC":
            return "assets/unit/mouse/mouse_beach.png";
          default:
            return "assets/unit/mouse/mouse_tan.png";
        }
      },
      getBreedingImage: (genotype) => {
        switch (genotype) {
          case "RR":
            return "assets/unit/mouse/mouse_field_nest.png";
          case "CC":
            return "assets/unit/mouse/mouse_beach_nest.png";
          default:
            return "assets/unit/mouse/mouse_tan_nest.png";
        }
      },
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
      phenotypeHeading: "Fur Color",
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
    },
    populations: {
      title: "Explore: Population",
    },
    organism: {
      title: "Explore: Organism",
    },
    breeding: {
      title: "Explore: Nesting Pairs",
      availableChartTypes: ["genotype", "phenotype", "sex"],
      offspringSize: 60,
    },
    dna: {
      title: "Explore: DNA",
    },
  },
  pea: {
    title: "Peas",
    species: {
        alleles: ["R", "r"],
        breedingPairs: [
          ["Rr", "RR"],
          ["rr", "RR"],
          ["rr", "rr"],
          ["RR", "RR"],
          ["Rr", "Rr"],
          ["rr", "Rr"]
        ],
        getBaseImage: (genotype) => {
          switch (genotype) {
            case "rr":
              return "assets/unit/pea/pea_wrinkled.png";
            default:
              return "assets/unit/pea/pea_round.png";
          }
        },
        getBreedingImage: (genotype) => {
          switch (genotype) {
            case "rr":
              return "assets/unit/pea/pea_wrinkled.png";
            default:
              return "assets/unit/pea/pea_round.png";
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
        phenotypeHeading: "Pea type",
        getPhenotypeLabel: (phenotype) => phenotype.charAt(0).toUpperCase() + phenotype.slice(1),
        getGenotypeHTMLLabel: (genotype) => genotype,
        chartTypes: {
          phenotype: {legend: [
            {label: "Round", color: colors.colorDataPeaRound},
            {label: "Wrinkled", color: colors.colorDataPeaWrinkled}
          ], title: "Pea Types" },
          genotype: {legend: [
            {label: "RR Peas", color: colors.colorDataMouseBrownLightRep},
            {label: "Rr Peas", color: colors.colorDataMouseBrownMediumRep},
            {label: "rR Peas", color: colors.colorDataMouseBrownMediumRep},
            {label: "rr Peas", color: colors.colorDataMouseBrownDarkRep}
          ], title: "Genotypes" }
        },
        getChartData: (chartType, data) => {
          let pieData = [];
          if (chartType === "genotype") {
            pieData = [{label: "RR", value: data.RR, color: colors.colorDataPeaDark},
                       {label: "Rr", value: data.Rr, color: colors.colorDataPeaRound},
                       {label: "rR", value: data.rR, color: colors.colorDataPeaRound},
                       {label: "rr", value: data.rr, color: colors.colorDataPeaWrinkled}];
          } else {
            pieData = [{label: "Round", value: data.round, color: colors.colorDataPeaRound},
                       {label: "Wrinkled", value: data.wrinkled, color: colors.colorDataPeaWrinkled}];
          }
          return pieData;
        },
      },
    populations: {
      title: "Explore: Population",
    },
    organism: {
      title: "Explore: Organism",
    },
    breeding: {
      title: "Greenhouse",
      availableChartTypes: ["genotype", "phenotype"],
      offspringSize: 90,
    },
    dna: {
      title: "Explore: DNA",
    },
  }
};

export const speciesDef = (unit: Unit) => units[unit].species;
