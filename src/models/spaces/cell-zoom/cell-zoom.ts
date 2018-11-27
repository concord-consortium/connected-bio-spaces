import { types, Instance } from "mobx-state-tree";
import { ColorType } from "../../mouse";
import { CellMouseModel } from "../../../components/spaces/cell-zoom/cell-mouse";
import { CellZoomRowModel, OrganelleType } from "./cell-zoom-row";

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
    organisms: types.map(CellMouseModel),
    rows: types.array(CellZoomRowModel)
  });

export type CellZoomModelType = Instance<typeof CellZoomModel>;
