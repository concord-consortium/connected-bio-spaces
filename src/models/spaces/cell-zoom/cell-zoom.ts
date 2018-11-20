import { types, Instance } from "mobx-state-tree";

export const Organelle = types.enumeration("type", [
  "nucleus",
  "cytoplasm",
  "golgi",
  "extracellular",
  "melanosome",
  "receptor",
  "gate",
  "nearbyCell"
]);
export type OrganelleType = typeof Organelle.Type;

type OrganelleInfo = {
  [key in OrganelleType]: {
    displayName: string;
  };
};
export const ORGANELLE_INFO: OrganelleInfo = {
  nucleus: {
    displayName: "Nucleus"
  },
  cytoplasm: {
    displayName: "Cytoplasm"
  },
  golgi: {
    displayName: "Golgi"
  },
  extracellular: {
    displayName: "Extracellular"
  },
  melanosome: {
    displayName: "Melanosome"
  },
  receptor: {
    displayName: "Receptor"
  },
  gate: {
    displayName: "Gate"
  },
  nearbyCell: {
    displayName: "Nearby Cell"
  },
};

export const Mode = types.enumeration("type", ["add", "subtract", "assay", "normal"]);
export type ModeType = typeof Mode.Type;

export const CellZoomModel = types
  .model("Populations", {
    hoveredOrganelle: types.maybe(Organelle),
    mode: types.optional(Mode, "normal")
  })
  .actions((self) => {
    return {
      setHoveredOrganelle(organelle: OrganelleType) {
        self.hoveredOrganelle = organelle;
      }
    };
  });

export type CellZoomModelType = Instance<typeof CellZoomModel>;
