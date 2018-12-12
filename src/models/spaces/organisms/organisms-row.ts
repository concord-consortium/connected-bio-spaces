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
    assayedOrganelles: types.array(Organelle),
    zoomLevel: types.optional(ZoomLevel, "organism"),
    showProteinDNA: false,
    showProteinAminoAcidsOnProtein: false,
    proteinSliderStartPercent: 0
  })
  .views(self => ({
    get currentData(): ChartDataModelType {
      const chartDataSets: any[] = [];
      const organelleLabels: string[] = [];

      self.assayedOrganelles.forEach((organelle) => {
        organelleLabels.push(organelle);
      });
      const colorMaps: any = { pheomelanin: "#f4ce83",
                               signalProtein: "#d88bff",
                               eumelanin: "#795423",
                               hormone: "#0adbd7" };
      let stackIterator = 0;
      kSubstanceNames.forEach((substance) => {
        const substanceName = substance === "signalProtein" ? "signal protein" : substance;
        const substanceColor: string = colorMaps[substance];
        const points: DataPointType[] = [];
        self.assayedOrganelles.forEach((organelle) => {
          if (!self.organismsMouse) {
            return;
          }
          const substanceValue = self.organismsMouse.getSubstanceValue(organelle, substance);
          points.push(DataPoint.create({ a1: substanceValue, a2: 0, label: `${organelle} ${substanceName}` }));
        });
        const stackNum = "Stack " + stackIterator;
        chartDataSets.push(ChartDataSetModel.create({
          name: substanceName,
          dataPoints: points,
          color: substanceColor,
          fixedMaxA2: 800,
          fixedMaxA1: 800,
          stack: stackNum
        }));
        stackIterator++;
      });

      const chart = ChartDataModel.create({
        name: "Substance Data",
        dataSets: chartDataSets,
        labels: organelleLabels,
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
        if (self.assayedOrganelles.indexOf(organelle) === -1) {
          self.assayedOrganelles.push(organelle);
        }
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
      },
      setShowProteinDNA(val: boolean) {
        self.showProteinDNA = val;
      },
      setShowProteinAminoAcidsOnProtein(val: boolean) {
        self.showProteinAminoAcidsOnProtein = val;
      },
      setProteinSliderStartPercent(val: number) {
        self.proteinSliderStartPercent = val;
      }
    };
  });

export type OrganismsRowModelType = Instance<typeof OrganismsRowModel>;
