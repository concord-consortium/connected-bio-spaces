import { types } from "mobx-state-tree";

export type Spaces = "populations" | "breeding" | "organism" | "none";     // eventually a union of all the spaces

export const UIModel = types
  .model("UI", {
    showInvestigationPanel: false,
    showPopulationGraph: false,
    investigationPanelSpace: "none",
    availableBackpackSlots: 6
  })
  .actions((self) => {
    return {
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
