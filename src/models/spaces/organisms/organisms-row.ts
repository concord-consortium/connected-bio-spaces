import { types, Instance } from "mobx-state-tree";
import { ChartDataModelType, ChartDataModel } from "../charts/chart-data";
import { DataPoint, ChartDataSetModel, ChartColors, DataPointType } from "../charts/chart-data-set";
import { OrganismsMouseModel } from "./organisms-mouse";
import { kSubstanceNames } from "./organisms-space";

export const Organelle = types.enumeration("type", [
  "nucleus",
  "cytoplasm",
  "golgi",
  "extracellular",
  "melanosome",
  "receptor",
  "receptorWorking",
  "receptorBroken",
  "gate",
  "nearbyCell"
]);
export type OrganelleType = typeof Organelle.Type;

export const Mode = types.enumeration("type", ["add", "subtract", "assay", "inspect", "normal"]);
export type ModeType = typeof Mode.Type;

export const ZoomLevel = types.enumeration("type", ["organism", "cell", "protein"]);
export type ZoomLevelType = typeof ZoomLevel.Type;

export const OrganismsRowModel = types
  .model("OrganismsRow", {
    organismsMouse: types.maybe(types.reference(OrganismsMouseModel)),
    hoveredOrganelle: types.maybe(Organelle),
    selectedOrganelle: types.maybe(Organelle),
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
          if (!self.organismsMouse) {
            return;
          }
          const substanceValue = self.organismsMouse.getSubstanceValue(organelle, substance);
          points.push(DataPoint.create({ a1: substanceValue, a2: 0, label: `${organelle} ${substance}` }));
        });
      }

      chartDataSets.push(ChartDataSetModel.create({
        name: self.assayedOrganelle || "",
        dataPoints: points,
        pointColors: ["#f4ce83", "#d88bff", "#795423", "#0adbd7"]
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
      setHoveredOrganelle(organelle?: OrganelleType) {
        self.hoveredOrganelle = organelle;
      },
      setActiveAssay(organelle: OrganelleType) {
        self.assayedOrganelle = organelle;
      },
      setSelectedOrganelle(organelle: OrganelleType) {
        self.selectedOrganelle = organelle;
      },
      setZoomLevel(zoomLevel: ZoomLevelType) {
        self.zoomLevel = zoomLevel;
        if (zoomLevel !== "protein") {
          self.selectedOrganelle = undefined;
        }
      },
      setMode(mode: ModeType) {
        self.mode = mode;
      }
    };
  });

export type OrganismsRowModelType = Instance<typeof OrganismsRowModel>;
