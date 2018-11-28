import { types, Instance } from "mobx-state-tree";
import { ColorType } from "../../mouse";
import { CellMouseModel } from "../../../components/spaces/cell-zoom/cell-mouse";
import { CellZoomRowModel, OrganelleType } from "./cell-zoom-row";
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
    cellOrganisms: types.optional(types.array(types.maybe(CellMouseModel)),
      [undefined, undefined, undefined, undefined, undefined, undefined]),
    rows: types.optional(types.array(CellZoomRowModel),
      [CellZoomRowModel.create(), CellZoomRowModel.create()])
  })
  .actions((self) => {
    function clearRowBackpackIndex(rowIndex: number) {
      const oldBackpackIndex = self.rows[rowIndex].backpackIndex;
      self.rows[rowIndex] = CellZoomRowModel.create({
        backpackIndex: undefined
      });

      if (oldBackpackIndex && !self.rows.some(row => row.backpackIndex === oldBackpackIndex)) {
        self.cellOrganisms[oldBackpackIndex] = undefined;
      }
    }

    return {
      clearRowBackpackIndex,
      setRowBackpackIndex(rowIndex: number, backpackIndex: number, backpack: BackpackModelType) {
        clearRowBackpackIndex(rowIndex);

        const backpackMouse = backpack.getMouseAtIndex(backpackIndex);
        if (!backpackMouse) {
          return;
        }

        let existingCellMouse = backpackIndex < self.cellOrganisms.length
          ? self.cellOrganisms[backpackIndex]
          : undefined;
        if (!existingCellMouse) {
          existingCellMouse = CellMouseModel.create({
            baseColor: backpackMouse.baseColor
          });
          self.cellOrganisms[backpackIndex] = existingCellMouse;
        }
        self.rows[rowIndex] = CellZoomRowModel.create({
          backpackIndex,
          organism: existingCellMouse
        });
      }
    };
  });

export type CellZoomModelType = Instance<typeof CellZoomModel>;
