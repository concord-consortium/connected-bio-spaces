import { SubstanceInfo, OrganelleInfo } from "../organisms-space";
import MouseProteins from "../../../../components/spaces/proteins/protein-specs/mouse-proteins";

export const kSubstanceInfo: SubstanceInfo = {
  hormone: {
    displayName: "Hormone",
    mysteryLabel: "substance D",
    color: "#00cc99",
    graphPattern: "diagonal"
  },
  signalProtein: {
    displayName: "Activated SP",
    mysteryLabel: "substance B",
    color: "#29abe2",
    graphPattern: "diagonal-right-left"
  },
  pheomelanin: {
    displayName: "Pheomelanin",
    mysteryLabel: "substance A",
    color: "#dfc39d",
  },
  eumelanin: {
    displayName: "Eumelanin",
    mysteryLabel: "substance C",
    color: "#5d3515",
  },
};

// Cell models can be viewed here:
// https://docs.google.com/spreadsheets/d/19f0nk-F3UQ_-A-agq5JnuhJXGCtFYMT_JcYCQkyqnQI/edit
export const kOrganelleInfo: OrganelleInfo = {
  nucleus: {
    displayName: "Nucleus",
    mysteryLabel: "Location 2",
    substances: {}
  },
  cytoplasm: {
    displayName: "Cytoplasm",
    mysteryLabel: "Location 3",
    substances: {
      signalProtein: {
        white: 0,
        tan: 110,
        brown: 170
      }
    }
  },
  golgi: {
    displayName: "Golgi",
    mysteryLabel: "",
    substances: {}
  },
  extracellular: {
    displayName: "Extracellular Space",
    mysteryLabel: "Location 4",
    substances: {
      hormone: {
        white: 125,
        tan: 125,
        brown: 125
      }
    }
  },
  melanosome: {
    displayName: "Melanosome",
    mysteryLabel: "Location 1",
    substances: {
      eumelanin: {
        white: 0,
        tan: 280,
        brown: 340
      },
      pheomelanin: {
        white: 317,
        tan: 207,
        brown: 147
      }
    }
  },
  receptor: {
    displayName: "Receptor",
    mysteryLabel: "",
    substances: {}
  },
  receptorWorking: {
    displayName: "Receptor",
    mysteryLabel: "",
    substances: {},
    protein: MouseProteins.receptor.working
  },
  receptorBroken: {
    displayName: "Receptor",
    mysteryLabel: "",
    substances: {},
    protein: MouseProteins.receptor.broken
  },
  gate: {
    displayName: "Gate",
    mysteryLabel: "",
    substances: {}
  },
  nearbyCell: {
    displayName: "Nearby Cell",
    mysteryLabel: "Location 5",
    substances: {}
  },
};
