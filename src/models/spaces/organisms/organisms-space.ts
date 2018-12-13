import { types, Instance } from "mobx-state-tree";
import { ColorType, BackpackMouseType } from "../../backpack-mouse";
import { OrganismsMouseModel } from "./organisms-mouse";
import { OrganismsRowModel, OrganelleType, OrganismsRowModelType } from "./organisms-row";
import { BackpackModelType } from "../../backpack";
import { ProteinSpec } from "../../../components/spaces/proteins/protein-viewer";
import MouseProteins from "../../../components/spaces/proteins/protein-specs/mouse-proteins";

export const kSubstanceNames = [
  "pheomelanin",
  "signalProtein",
  "eumelanin",
  "hormone"
];
export const Substance = types.enumeration("Substance", kSubstanceNames);
export type SubstanceType = typeof Substance.Type;

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
        tan: 100,
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
        tan: 170,
        brown: 340
      },
      pheomelanin: {
        white: 316,
        tan: 232,
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

export const OrganismsSpaceModel = types
  .model("OrganismsSpace", {
    organismsMice: types.array(OrganismsMouseModel),
    rows: types.optional(types.array(OrganismsRowModel),
      [OrganismsRowModel.create(), OrganismsRowModel.create()]),
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
        self.rows[rowIndex] = OrganismsRowModel.create({ organismsMouse });
      }
    };
  });

export type OrganismsSpaceModelType = Instance<typeof OrganismsSpaceModel>;
