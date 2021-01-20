import { types, Instance, resolveIdentifier } from "mobx-state-tree";
import { ColorType, BackpackMouseType, BackpackMouse } from "../../backpack-mouse";
import { ProteinSpec } from "../../../components/spaces/proteins/protein-viewer";
import { kOrganelleInfo, kSubstanceInfo } from "./mouse/mouse-cell-data";
import { RightPanelType } from "../../ui";
import { OrganismsMouseModel, OrganelleType, SubstanceType } from "./mouse/organisms-mouse";
import { OrganismsRowModel } from "./organisms-row";
import { BackpackModelType } from "../../backpack";
import { GraphPatternType } from "../charts/chart-data-set";
import { Unit } from "../../../authoring";

export type SubstanceInfo = {
  [substance in SubstanceType]: {
    displayName: string;
    mysteryLabel: string;
    color: string;
    graphPattern?: GraphPatternType;
  };
};

export type OrganelleInfo = {
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

export function createOrganismsModel(unit: Unit, organismsProps: any, backpack: BackpackModelType) {
  switch (unit) {
    case "pea":
      return null;
    case "mouse":
    default:
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
}

export const OrganismsSpaceModel = types
  .model("OrganismsSpace", {
    organismsMice: types.array(OrganismsMouseModel),
    rows: types.optional(types.array(OrganismsRowModel),
      [OrganismsRowModel.create(), OrganismsRowModel.create({rightPanel: "data"})]),
    useMysteryOrganelles: false,
    useMysterySubstances: false,
    instructions: "",
    showZoomToReceptor: true,
    showZoomToNucleus: true,
    showProteinInfoBox: false
  })
  .volatile(self => ({
    proteinSliderStartPercent: 0,
    proteinSliderSelectedAminoAcidIndex: 0
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

      // keep right panel as-is, unless it's on "information" which doesn't make sense for no org
      let rightPanel: RightPanelType = (rowIndex === 0 && self.instructions) ? "instructions" : "data";
      if (self.rows[rowIndex] && self.rows[rowIndex].rightPanel && self.rows[rowIndex].rightPanel !== "information") {
        rightPanel = self.rows[rowIndex].rightPanel;
      }

      self.rows[rowIndex] = OrganismsRowModel.create({ rightPanel });

      if (clearedOrganismsMouse) {
        if (!self.rows.some(row => row.organismsMouse === clearedOrganismsMouse)) {
          self.organismsMice.remove(clearedOrganismsMouse);
        }
      }
    }

    return {

      afterCreate() {
        if (!self.instructions) {
          if (self.rows[0]) {
            self.rows[0].rightPanel = "data";
          }
        }
      },

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
        let rightPanel: RightPanelType = (rowIndex === 0 && self.instructions) ? "instructions" : "data";
        if (self.rows[rowIndex] && self.rows[rowIndex].rightPanel) {
          rightPanel = self.rows[rowIndex].rightPanel;
        }

        self.rows[rowIndex] = OrganismsRowModel.create({ organismsMouse, rightPanel });
      },

      setProteinSliderStartPercent(val: number) {
        self.proteinSliderStartPercent = val;
      },
      setProteinSliderSelectedAminoAcidIndex: (selectedAminoAcidIndex: number) => {
        self.proteinSliderSelectedAminoAcidIndex = selectedAminoAcidIndex;
      },
      setShowInfoBox(val: boolean) {
        self.showProteinInfoBox = val;
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
