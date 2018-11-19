import { types } from "mobx-state-tree";

export type Spaces = "populations";     // eventually a union of all the spaces

export const UIModel = types
  .model("UI", {
    showInvestigationModalSelect: false,
    showInvestigationPanel: false,
    showPopulationGraph: false,
    investigationPanelSpace: "populations",
    availableBackpackSlots: 6
  })
  .actions((self) => {
    return {
      setShowInvestigationModalSelect(val: boolean) {
        self.showInvestigationModalSelect = val;
      },
      setShowInvestigationPanel(val: boolean) {
        self.showInvestigationPanel = val;
      },
      setShowPopulationGraph(val: boolean) {
        self.showPopulationGraph = val;
      },
      setInvestigationPanelSpace(space: Spaces) {
        self.investigationPanelSpace = space;
      },
      setAvailableBackpackSlots(val: number) {
        self.availableBackpackSlots = val;
      }
    };
  });

export type UIModelType = typeof UIModel.Type;
