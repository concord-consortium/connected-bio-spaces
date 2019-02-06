import { types, Instance } from "mobx-state-tree";
import { ColorType, BackpackMouseType } from "../../backpack-mouse";
import { ProteinSpec } from "../../../components/spaces/proteins/protein-viewer";
import MouseProteins from "../../../components/spaces/proteins/protein-specs/mouse-proteins";
import { RightPanelType } from "../../ui";
import { OrganismsMouseModel, OrganelleType, SubstanceType } from "./organisms-mouse";
import { OrganismsRowModel } from "./organisms-row";

type SubstanceInfo = {
  [substance in SubstanceType]: {
    displayName: string;
    mysteryLabel: string;
    color: string;
  };
};
export const kSubstanceInfo: SubstanceInfo = {
  pheomelanin: {
    displayName: "pheomelanin",
    mysteryLabel: "substance A",
    color: "#f4ce83"
  },
  signalProtein: {
    displayName: "signal protein",
    mysteryLabel: "substance B",
    color: "#d88bff"
  },
  eumelanin: {
    displayName: "eumelanin",
    mysteryLabel: "substance C",
    color: "#795423"
  },
  hormone: {
    displayName: "hormone",
    mysteryLabel: "substance D",
    color: "#0adbd7"
  },
};

type OrganelleInfo = {
  [organelle in OrganelleType]: {
    displayName: string;
    mysteryLabel: string;
    substances: {
      [substance in SubstanceType]?: {
        [color in ColorType]: number;
      };
    };
    protein?: ProteinSpec;
  };
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
    displayName: "Extracellular",
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

export const OrganismsSpaceModel = types
  .model("OrganismsSpace", {
    organismsMice: types.array(OrganismsMouseModel),
    rows: types.optional(types.array(OrganismsRowModel),
      [OrganismsRowModel.create(), OrganismsRowModel.create({rightPanel: "data"})]),
    useMysteryOrganelles: false,
    useMysterySubstances: false,
    instructions: ""
  })
  .views(self => {
    return {
      getOrganelleLabel(organelle: OrganelleType) {
        if (self.useMysteryOrganelles) {
          return kOrganelleInfo[organelle].mysteryLabel;
        }
        return kOrganelleInfo[organelle].displayName;
      },
      getSubstanceLabel(substance: SubstanceType) {
        if (self.useMysterySubstances) {
          return kSubstanceInfo[substance].mysteryLabel;
        }
        return kSubstanceInfo[substance].displayName;
      }
    };
  })
  .actions((self) => {
    function clearRowBackpackMouse(rowIndex: number) {
      const clearedOrganismsMouse = self.rows[rowIndex].organismsMouse;
      self.rows[rowIndex] = OrganismsRowModel.create();

      if (clearedOrganismsMouse) {
        if (!self.rows.some(row => row.organismsMouse === clearedOrganismsMouse)) {
          self.organismsMice.remove(clearedOrganismsMouse);
        }
      }
    }

    return {
      clearRowBackpackMouse,
      setRowBackpackMouse(rowIndex: number, backpackMouse: BackpackMouseType) {
        let organismsMouse = self.organismsMice.find((existingOrganismsMouse) => {
          return existingOrganismsMouse.backpackMouse === backpackMouse;
        });
        if (!organismsMouse) {
          organismsMouse = OrganismsMouseModel.create({ backpackMouse });
          self.organismsMice.push(organismsMouse);
        }

        // keep right panel as it was
        let rightPanel: RightPanelType = rowIndex === 0 ? "instructions" : "data";
        if (self.rows[rowIndex] && self.rows[rowIndex].rightPanel) {
          rightPanel = self.rows[rowIndex].rightPanel;
        }

        // sync initial slider position
        let proteinSliderStartPercent = 0;
        const otherRow = -(rowIndex - 1);
        if (self.rows[otherRow] && self.rows[otherRow].proteinSliderStartPercent) {
          proteinSliderStartPercent = self.rows[otherRow].proteinSliderStartPercent;
        }

        self.rows[rowIndex] = OrganismsRowModel.create({ organismsMouse, proteinSliderStartPercent, rightPanel });
      }
    };
  });

export type OrganismsSpaceModelType = Instance<typeof OrganismsSpaceModel>;
