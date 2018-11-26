import { types, Instance } from "mobx-state-tree";
import { ChartDataModelType, ChartDataModel } from "../charts/chart-data";
import { DataPoint, ChartDataSetModel, ChartColors, DataPointType } from "../charts/chart-data-set";
import { ColorType } from "../../mouse";
import { CellMouseModel } from "../../../components/spaces/cell-zoom/cell-mouse";

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

export const Mode = types.enumeration("type", ["add", "subtract", "assay", "normal"]);
export type ModeType = typeof Mode.Type;

export const CellZoomModel = types
  .model("Populations", {
    organism: CellMouseModel,
    hoveredOrganelle: types.maybe(Organelle),
    mode: types.optional(Mode, "normal"),
    assayedOrganelle: types.maybe(Organelle)
  })
  .views(self => ({
    get currentData(): ChartDataModelType {
      const chartDataSets = [];
      const points: DataPointType[] = [];
      const organelle = self.assayedOrganelle;
      if (organelle) {
        kSubstanceNames.forEach((substance) => {
          const substanceValue = self.organism.getSubstanceValue(organelle, substance);
          if (substanceValue > 0) {
            points.push(DataPoint.create({ a1: substanceValue, a2: 0, label: substance }));
          }
        });
      }

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
      },
      setActiveAssay(organelle: OrganelleType) {
        self.assayedOrganelle = organelle;
      }
    };
  });

export type CellZoomModelType = Instance<typeof CellZoomModel>;
