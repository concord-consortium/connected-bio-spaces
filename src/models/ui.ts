import { types } from "mobx-state-tree";

export type Spaces = "none" | "populations";

export const UIModel = types
  .model("UI", {
    showInvestigationModalSelect: false,
    showInvestigationPanel: false,
    showPopulationGraph: false,
    investigationPanelSpace: "none"
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
      }
    };
  });

export type UIModelType = typeof UIModel.Type;
