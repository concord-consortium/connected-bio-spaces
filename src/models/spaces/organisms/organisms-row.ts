import { types, Instance, getParentOfType } from "mobx-state-tree";
import { ChartDataModelType, ChartDataModel } from "../charts/chart-data";
import { RightPanelTypeEnum, RightPanelType } from "../../ui";
import { DataPoint, ChartDataSetModel, DataPointType, ChartDataSetModelType } from "../charts/chart-data-set";
import { OrganismsMouseModel, Organelle, Substance, kSubstanceNames,
  OrganelleType, SubstanceType } from "./organisms-mouse";
import { kSubstanceInfo, OrganismsSpaceModel, OrganismsSpaceModelType, kOrganelleInfo } from "./organisms-space";

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
    proteinSliderStartPercent: 0,
    rightPanel: types.optional(RightPanelTypeEnum, "instructions"),
    selectedSubstance: types.optional(Substance, "hormone")
  })
  .views(self => ({
    get currentData(): ChartDataModelType {
      const chartDataSets: ChartDataSetModelType[] = [];
      const organelleLabels: string[] = [];

      const organisms = getParentOfType(self, OrganismsSpaceModel);

      self.assayedOrganelles.forEach((organelle) => {
        const organelleLabel = organisms ? organisms.getOrganelleLabel(organelle) : organelle;
        organelleLabels.push(organelleLabel);
      });
      kSubstanceNames.forEach((substance, index) => {
        const substanceName: string = organisms
          ? organisms.getSubstanceLabel(substance)
          : kSubstanceInfo[substance].displayName;
        const substanceColor: string =  kSubstanceInfo[substance].color;
        const points: DataPointType[] = [];
        self.assayedOrganelles.forEach((organelle) => {
          if (!self.organismsMouse) {
            return;
          }
          const substanceValue = self.organismsMouse.getSubstanceValue(organelle, substance);
          const organelleLabel = organisms ? organisms.getOrganelleLabel(organelle) : organelle;
          points.push(DataPoint.create({ a1: substanceValue, a2: 0, label: `${organelleLabel} ${substanceName}` }));
        });
        const stackNum = "Stack " + index;
        chartDataSets.push(ChartDataSetModel.create({
          name: substanceName,
          dataPoints: points,
          color: substanceColor,
          fixedMaxA2: 800,
          fixedMaxA1: 800,
          stack: stackNum
        }));
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
        if (self.organismsMouse) {
          if (mode === "normal") {
            self.organismsMouse.setPaused(false);
          } else {
            self.organismsMouse.setPaused(true);
          }
        }
      },
      setShowProteinDNA(val: boolean) {
        self.showProteinDNA = val;
      },
      setShowProteinAminoAcidsOnProtein(val: boolean) {
        self.showProteinAminoAcidsOnProtein = val;
      },
      setProteinSliderStartPercent(val: number) {
        self.proteinSliderStartPercent = val;
      },
      setRightPanel(val: RightPanelType) {
        self.rightPanel = val;
      },
      setSelectedSubstance(substance: SubstanceType) {
        self.selectedSubstance = substance;
      }
    };
  })
  .postProcessSnapshot(snapshot => {
    // remove props we don't need to serialize
    const {
      hoveredOrganelle,
      selectedOrganelle,
      selectedSubstance,
      ...remainder
    } = snapshot;
    return remainder;
  });

export type OrganismsRowModelType = Instance<typeof OrganismsRowModel>;
