import { types, Instance } from "mobx-state-tree";
import { ColorType, BackpackMouseType } from "../../backpack-mouse";
import { CellMouseModel } from "./cell-mouse";
import { CellZoomRowModel, OrganelleType, CellZoomRowModelType } from "./cell-zoom-row";
import { BackpackModelType } from "../../backpack";

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
  gate: {
    displayName: "Gate",
    substances: {}
  },
  nearbyCell: {
    displayName: "Nearby Cell",
    substances: {}
  },
};

export const CellZoomModel = types
  .model("CellZoom", {
    cellOrganisms: types.array(CellMouseModel),
    rows: types.optional(types.array(CellZoomRowModel),
      [CellZoomRowModel.create(), CellZoomRowModel.create()])
  })
  .actions((self) => {
    function clearRowBackpackMouse(rowIndex: number) {
      const clearedCellMouse = self.rows[rowIndex].cellMouse;
      self.rows[rowIndex] = CellZoomRowModel.create();

      if (clearedCellMouse) {
        if (!self.rows.some(row => row.cellMouse === clearedCellMouse)) {
          self.cellOrganisms.remove(clearedCellMouse);
        }
      }
    }

    return {
      clearRowBackpackMouse,
      setRowBackpackMouse(rowIndex: number, backpackMouse: BackpackMouseType) {
        let cellMouse = self.cellOrganisms.find((existingCellMouse) => {
          return existingCellMouse.backpackMouse === backpackMouse;
        });
        if (!cellMouse) {
          cellMouse = CellMouseModel.create({ backpackMouse });
          self.cellOrganisms.push(cellMouse);
        }
        self.rows[rowIndex] = CellZoomRowModel.create({ cellMouse });
      }
    };
  });

export type CellZoomModelType = Instance<typeof CellZoomModel>;
