import { types } from "mobx-state-tree";

export const SpaceTypeEnum = types.enumeration("type", ["populations", "breeding", "organism", "dna", "none"]);
export type SpaceType = typeof SpaceTypeEnum.Type;

export function createUIModel(authoring: any): UIModelType {
  let displayedSpace = authoring.displayedSpace;
  if (!authoring.showPopulationSpace && displayedSpace === "populations" ||
      !authoring.showBreedingSpace && displayedSpace === "breeding" ||
      !authoring.showOrganismSpace && displayedSpace === "organism" ||
      !authoring.showDNASpace && displayedSpace === "dna") {
        displayedSpace = "none";
  }
  return UIModel.create({
    showOrganismGraph: [false, true],
    investigationPanelSpace: displayedSpace,
    showPopulationSpace: authoring.showPopulationSpace,
    showBreedingSpace: authoring.showBreedingSpace,
    showOrganismSpace: authoring.showOrganismSpace,
    showDNASpace: authoring.showDNASpace
  });
}

export const UIModel = types
  .model("UI", {
    showPopulationGraph: false,
    showOrganismGraph: types.array(types.boolean),
    investigationPanelSpace: SpaceTypeEnum,
    availableBackpackSlots: 6,
    showPopulationSpace: true,
    showBreedingSpace: false,
    showOrganismSpace: true,
    showDNASpace: false
  })
  .actions((self) => {
    return {
      setShowOrganismGraph(rowIndex: number, val: boolean) {
        self.showOrganismGraph[rowIndex] = val;
      },
      setShowPopulationGraph(val: boolean) {
        self.showPopulationGraph = val;
      },
      setInvestigationPanelSpace(space: SpaceType) {
        self.investigationPanelSpace = space;
      }
    };
  });

export type UIModelType = typeof UIModel.Type;
