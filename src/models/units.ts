import { Unit } from "../authoring";

interface UnitDefinition {
  title: string;
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
    populations: {
      title: "Explore: Population",
    },
    organism: {
      title: "Explore: Population",
    },
    breeding: {
      title: "Greenhouse",
    },
    dna: {
      title: "Explore: DNA",
    },
  }
};
