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
    color: string;
  };
};
export const kSubstanceInfo: SubstanceInfo = {
  pheomelanin: {
    displayName: "pheomelanin",
    color: "#f4ce83"
  },
  signalProtein: {
    displayName: "signal protein",
    color: "#d88bff"
  },
  eumelanin: {
    displayName: "eumelanin",
    color: "#795423"
  },
  hormone: {
    displayName: "hormone",
    color: "#0adbd7"
  },
};

type OrganelleInfo = {
  [organelle in OrganelleType]: {
    displayName: string;
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
    substances: {}
  },
  cytoplasm: {
    displayName: "Cytoplasm",
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
    substances: {}
  },
  extracellular: {
    displayName: "Extracellular",
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
    substances: {}
  },
  receptorWorking: {
    displayName: "Receptor",
    substances: {},
    protein: MouseProteins.receptor.working
  },
  receptorBroken: {
    displayName: "Receptor",
    substances: {},
    protein: MouseProteins.receptor.broken
  },
  gate: {
    displayName: "Gate",
    substances: {}
  },
  nearbyCell: {
    displayName: "Nearby Cell",
    substances: {}
  },
};

export const getSubstanceBaseValueForColor = (organelle: OrganelleType, substance: SubstanceType, color: ColorType) => {
  const substanceValues = kOrganelleInfo[organelle].substances[substance];
  return substanceValues ? substanceValues[color] : 0;
};

export const OrganismsSpaceModel = types
  .model("OrganismsSpace", {
    organismsMice: types.array(OrganismsMouseModel),
    rows: types.optional(types.array(OrganismsRowModel),
      [OrganismsRowModel.create(), OrganismsRowModel.create({rightPanel: "data"})]),
    instructions: ""
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
