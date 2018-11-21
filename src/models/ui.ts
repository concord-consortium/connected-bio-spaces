import { types } from "mobx-state-tree";

export const SpaceTypeEnum = types.enumeration("type", ["populations", "breeding", "organism", "dna", "none"]);
export type SpaceType = typeof SpaceTypeEnum.Type;

export const UIModel = types
  .model("UI", {
    showPopulationGraph: false,
    investigationPanelSpace: SpaceTypeEnum,
    availableBackpackSlots: 6
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
