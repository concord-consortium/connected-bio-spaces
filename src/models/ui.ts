import { types } from "mobx-state-tree";

export const SpaceTypeEnum = types.enumeration("type", ["populations", "breeding", "organism", "dna", "none"]);
export type SpaceType = typeof SpaceTypeEnum.Type;

export function createUIModel(authoring: any): UIModelType {
  if (!authoring.showPopulationSpace && authoring.displayedSpace === "populations" ||
      !authoring.showBreedingSpace && authoring.displayedSpace === "breeding" ||
      !authoring.showOrganismSpace && authoring.displayedSpace === "organism" ||
      !authoring.showDNASpace && authoring.displayedSpace === "dna") {
    authoring.displayedSpace = "none";
  }
  return UIModel.create({
    investigationPanelSpace: authoring.displayedSpace,
    showPopulationSpace: authoring.showPopulationSpace,
    showBreedingSpace: authoring.showBreedingSpace,
    showOrganismSpace: authoring.showOrganismSpace,
    showDNASpace: authoring.showDNASpace
  });
}

export const UIModel = types
  .model("UI", {
    showPopulationGraph: false,
    investigationPanelSpace: SpaceTypeEnum,
    availableBackpackSlots: 6,
    showPopulationSpace: true,
    showBreedingSpace: false,
    showOrganismSpace: true,
    showDNASpace: false
  })
  .actions((self) => {
    return {
      setShowPopulationGraph(val: boolean) {
        self.showPopulationGraph = val;
      },
      setInvestigationPanelSpace(space: SpaceType) {
        self.investigationPanelSpace = space;
      },
      setAvailableBackpackSlots(val: number) {
        self.availableBackpackSlots = val;
      }
    };
  });

export type UIModelType = typeof UIModel.Type;
