import { types, Instance } from "mobx-state-tree";
import { ChartDataModelType, ChartDataModel } from "../charts/chart-data";
import { DataPoint, ChartDataSetModel, ChartColors } from "../charts/chart-data-set";

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
  .views(self => ({
    get currentData(): ChartDataModelType {
      const chartDataSets = [];
      const points = [];
      points.push (DataPoint.create({ a1: 40, a2: 0, label: "alpha" }));
      points.push (DataPoint.create({ a1: 20, a2: 0, label: "bravo" }));
      points.push(DataPoint.create({ a1: 50, a2: 0, label: "charlie" }));

      chartDataSets.push(ChartDataSetModel.create({
        name: "Sample Dataset1",
        dataPoints: points,
        color: ChartColors[0].hex,
        maxPoints: 100
      }));

      const chart = ChartDataModel.create({
        name: "Samples",
        dataSets: chartDataSets
      });
      return chart;
    }
  }))
  .actions((self) => {
    return {
      setHoveredOrganelle(organelle: OrganelleType) {
        self.hoveredOrganelle = organelle;
      }
    };
  });

export type CellZoomModelType = Instance<typeof CellZoomModel>;
