import { types, Instance, getParentOfType } from "mobx-state-tree";
import { ChartDataModelType, ChartDataModel } from "../charts/chart-data";
import { RightPanelTypeEnum, RightPanelType } from "../../ui";
import { DataPoint, ChartDataSetModel, DataPointType, ChartDataSetModelType } from "../charts/chart-data-set";
import { OrganismsMouseModel, Organelle, Substance, kSubstanceNames,
  OrganelleType, SubstanceType } from "./mouse/organisms-mouse";
import { kSubstanceInfo } from "./mouse/mouse-cell-data";
import { OrganismsSpaceModel } from "./organisms-space";

export const Mode = types.enumeration("type", ["add", "subtract", "assay", "inspect", "target-zoom", "normal"]);
export type ModeType = typeof Mode.Type;

export const ZoomLevel = types.enumeration("type", ["organism", "cell", "receptor", "nucleus"]);
export type ZoomLevelType = typeof ZoomLevel.Type;

export const ZoomTarget = types.enumeration("type", ["receptor", "nucleus"]);
export type ZoomTargetType = typeof ZoomTarget.Type;

export const NucleusState = types.enumeration("type", ["expanded", "condensed", "paired"]);
export type NucleusStateType = typeof NucleusState.Type;

export const ChromosomeId = types.enumeration("type", ["c2a", "c2b", "c8a", "c8b", "x1", "x2", "y"]);
export type ChromIdType = typeof ChromosomeId.Type;

export const OrganismsRowModel = types
  .model("OrganismsRow", {
    organismsMouse: types.maybe(types.reference(OrganismsMouseModel)),
    hoveredOrganelle: types.maybe(Organelle),
    selectedOrganelle: types.maybe(Organelle),
    mode: types.optional(Mode, "normal"),
    assayedOrganelles: types.array(Organelle),
    zoomLevel: types.optional(ZoomLevel, "organism"),
    hoveredZoomTarget: types.maybe(ZoomTarget),
    showProteinDNA: false,
    showProteinAminoAcidsOnProtein: true,
    rightPanel: types.optional(RightPanelTypeEnum, "instructions"),
    selectedSubstance: types.optional(Substance, "hormone"),
    nucleusColored: false,
    nucleusState: types.optional(NucleusState, "expanded"),
    selectedChromosome: types.maybe(ChromosomeId)
  })
  .volatile(self => ({
    previousZoomLevel: types.maybe(ZoomLevel),
  }))
  .views(self => ({
    get currentData(): ChartDataModelType {
      const chartDataSets: ChartDataSetModelType[] = [];
      const organelleLabels: any = [];

      const organisms = getParentOfType(self, OrganismsSpaceModel);

      self.assayedOrganelles.forEach((organelle) => {
        const organelleLabel = organisms ? organisms.getOrganelleLabel(organelle) : organelle;
        organelleLabels.push(organelleLabel.split(" "));
      });
      kSubstanceNames.forEach((substance, index) => {
        const substanceName: string = organisms
          ? organisms.getSubstanceLabel(substance)
          : kSubstanceInfo[substance].displayName;
        const substanceColor: string =  kSubstanceInfo[substance].color;
        const substancePattern = kSubstanceInfo[substance].graphPattern;
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
          graphPattern: substancePattern,
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
        if (self.zoomLevel) {
          self.previousZoomLevel = self.zoomLevel as any;
        }
        self.zoomLevel = zoomLevel;

        // reset stuff between levels
        if (zoomLevel !== "receptor") {
          self.selectedOrganelle = undefined;
        }
        self.mode = "normal";
        self.hoveredZoomTarget = undefined;

        self.nucleusState = "expanded";
        self.nucleusColored = false;
        self.selectedChromosome = undefined;
      },
      setHoveredZoomTarget(target?: ZoomTargetType) {
        self.hoveredZoomTarget = target;
      },
      setMode(mode: ModeType) {
        self.mode = mode;
        if (self.organismsMouse) {
          if (mode === "normal" || mode === "target-zoom") {
            self.organismsMouse.setPaused(false);
          } else {
            self.organismsMouse.setPaused(true);
          }
        }
        self.selectedChromosome = undefined;
      },
      setShowProteinDNA(val: boolean) {
        self.showProteinDNA = val;
      },
      setShowProteinAminoAcidsOnProtein(val: boolean) {
        self.showProteinAminoAcidsOnProtein = val;
      },
      setRightPanel(val: RightPanelType) {
        self.rightPanel = val;
      },
      setSelectedSubstance(substance: SubstanceType) {
        self.selectedSubstance = substance;
      },
      toggleNucleusColor() {
        self.nucleusColored = !self.nucleusColored;
      },
      toggleNucleusCondense() {
        if (self.nucleusState !== "expanded") {   // condensed || paired
          self.nucleusState = "expanded";
          self.mode = "normal";
          self.selectedChromosome = undefined;
        } else {
          self.nucleusState = "condensed";
        }
      },
      toggleNucleusPair() {
        if (self.nucleusState !== "paired") {   // condensed || expanded
          self.nucleusState = "paired";
        } else {
          self.nucleusState = "condensed";
        }
      },
      setSelectedChromosome(chromosome: ChromIdType) {
        self.selectedChromosome = chromosome;
        self.rightPanel = "information";
      },
    };
  })
  .postProcessSnapshot(snapshot => {
    // remove props we don't need to serialize
    const {
      hoveredOrganelle,
      selectedOrganelle,
      selectedSubstance,
      selectedChromosome,
      hoveredZoomTarget,
      ...remainder
    } = snapshot;
    return remainder;
  });

export type OrganismsRowModelType = Instance<typeof OrganismsRowModel>;
