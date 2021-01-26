import { types } from "mobx-state-tree";
import { Unit } from "../authoring";

export const UnitTypeEnum = types.enumeration("unit", ["mouse", "pea"]);

export interface UnitSpecies {
  alleles: string[];
  breedingPairs: string[][];
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
