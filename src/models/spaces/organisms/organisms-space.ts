import { types, Instance, resolveIdentifier } from "mobx-state-tree";
import { ColorType, BackpackMouseType, BackpackMouse } from "../../backpack-mouse";
import { ProteinSpec } from "../../../components/spaces/proteins/protein-viewer";
import MouseProteins from "../../../components/spaces/proteins/protein-specs/mouse-proteins";
import { RightPanelType } from "../../ui";
import { OrganismsMouseModel, OrganelleType, SubstanceType } from "./organisms-mouse";
import { OrganismsRowModel } from "./organisms-row";
import { BackpackModelType } from "../../backpack";
import { GraphPatternType } from "../charts/chart-data-set";

type SubstanceInfo = {
  [substance in SubstanceType]: {
    displayName: string;
    mysteryLabel: string;
    color: string;
    graphPattern?: GraphPatternType;
  };
};
export const kSubstanceInfo: SubstanceInfo = {
  hormone: {
    displayName: "Hormone",
    mysteryLabel: "substance D",
    color: "#00cc99",
    graphPattern: "diagonal"
  },
  signalProtein: {
    displayName: "Signal Protein",
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

export function createOrganismsModel(organismsProps: any, backpack: BackpackModelType) {
  if (organismsProps.organismsMice) {
    organismsProps.organismsMice = organismsProps.organismsMice.map((organismMouse: any) => {
      return {
        ...organismMouse,
        backpackMouse: resolveIdentifier(BackpackMouse, backpack, organismMouse.backpackMouse)
      };
    });
  }
  return OrganismsSpaceModel.create(organismsProps);
}

export const OrganismsSpaceModel = types
  .model("OrganismsSpace", {
    organismsMice: types.array(OrganismsMouseModel),
    rows: types.optional(types.array(OrganismsRowModel),
      [OrganismsRowModel.create(), OrganismsRowModel.create({rightPanel: "data"})]),
    useMysteryOrganelles: false,
    useMysterySubstances: false,
    instructions: "",
    showProteinInfoBox: false
  })
  .volatile(self => ({
    proteinSliderStartPercent: 0,
    proteinSliderSelectedAminoAcidIndex: 0,
    proteinSliderSelectedAminoAcidXLocation: 0
  }))
  .views(self => {
    return {
      get firstEmptyRow() {
        if (!self.rows[0].organismsMouse) {
          return 0;
        }
        if (!self.rows[1].organismsMouse) {
          return 1;
        }
        return null;
      },
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

        self.rows[rowIndex] = OrganismsRowModel.create({ organismsMouse, rightPanel });
      },

      setProteinSliderStartPercent(val: number) {
        self.proteinSliderStartPercent = val;
      },
      setProteinSliderSelectedAminoAcidIndex: (selectedAminoAcidIndex: number, selectedAminoAcidXLocation: number) => {
        self.proteinSliderSelectedAminoAcidIndex = selectedAminoAcidIndex;
        self.proteinSliderSelectedAminoAcidXLocation = selectedAminoAcidXLocation;
      },
      toggleShowInfoBox() {
        self.showProteinInfoBox = !self.showProteinInfoBox;
      }
    };
  })
  .actions(self => ({
    activeBackpackMouseUpdated(backpackMouse: BackpackMouseType) {
      if (self.firstEmptyRow !== null) {
        self.setRowBackpackMouse(self.firstEmptyRow, backpackMouse);
        return true;
      }
    }
  }));

export type OrganismsSpaceModelType = Instance<typeof OrganismsSpaceModel>;
