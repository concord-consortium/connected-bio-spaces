import { types, Instance } from "mobx-state-tree";
import { ChartDataModelType, ChartDataModel } from "../charts/chart-data";
import { DataPoint, ChartDataSetModel, ChartColors, DataPointType } from "../charts/chart-data-set";
import { CellMouseModel } from "./cell-mouse";
import { kSubstanceNames } from "./cell-zoom";

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

export const Mode = types.enumeration("type", ["add", "subtract", "assay", "normal"]);
export type ModeType = typeof Mode.Type;

export const ZoomLevel = types.enumeration("type", ["organism", "cell", "protein"]);
export type ZoomLevelType = typeof ZoomLevel.Type;

export const CellZoomRowModel = types
  .model("CellZoomRow", {
    cellMouse: types.maybe(types.reference(CellMouseModel)),
    hoveredOrganelle: types.maybe(Organelle),
    mode: types.optional(Mode, "normal"),
    assayedOrganelle: types.maybe(Organelle),
    zoomLevel: types.optional(ZoomLevel, "organism")
  })
  .views(self => ({
    get currentData(): ChartDataModelType {
      const chartDataSets = [];
      const points: DataPointType[] = [];
      const organelle = self.assayedOrganelle;
      if (organelle) {
        kSubstanceNames.forEach((substance) => {
          if (!self.cellMouse) {
            return;
          }
          const substanceValue = self.cellMouse.getSubstanceValue(organelle, substance);
          if (substanceValue > 0) {
            points.push(DataPoint.create({ a1: substanceValue, a2: 0, label: substance }));
          }
        });
      }

      chartDataSets.push(ChartDataSetModel.create({
        name: "Sample Dataset1",
        dataPoints: points,
        color: ChartColors[0].hex, // all bars will be this color
        // alternatively, use a specified array of specific colors for each bar:
        // pointColors: ["#00ff00", "#ff0000"]
        // if no color and no pointColors are specified, each bar will take on a color from ChartColors
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
      },
      setZoomLevel(zoomLevel: ZoomLevelType) {
        self.zoomLevel = zoomLevel;
      }
    };
  });

export type CellZoomRowModelType = Instance<typeof CellZoomRowModel>;
