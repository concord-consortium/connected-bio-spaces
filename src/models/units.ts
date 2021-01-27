import { types } from "mobx-state-tree";
import { Unit } from "../authoring";

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
      }
    },
    populations: {
      title: "Explore: Population",
    },
    organism: {
      title: "Explore: Organism",
    },
    breeding: {
      title: "Explore: Nesting Pairs",
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
              return "assets/unit/pea/pea_smooth.png";
          }
        },
        getBreedingImage: (genotype) => {
          switch (genotype) {
            case "rr":
              return "assets/unit/pea/pea_wrinkled.png";
            default:
              return "assets/unit/pea/pea_smooth.png";
          }
        },
        getPhenotype: (genotype) => {
          switch (genotype) {
            case "rr":
              return "wrinkled";
            default:
              return "smooth";
          }
        },
        phenotypeHeading: "Pea type",
        getPhenotypeLabel: (phenotype) => phenotype.charAt(0).toUpperCase() + phenotype.slice(1),
        getGenotypeHTMLLabel: (genotype) => genotype,
      },
    populations: {
      title: "Explore: Population",
    },
    organism: {
      title: "Explore: Organism",
    },
    breeding: {
      title: "Greenhouse",
    },
    dna: {
      title: "Explore: DNA",
    },
  }
};

export const speciesDef = (unit: Unit) => units[unit].species;
