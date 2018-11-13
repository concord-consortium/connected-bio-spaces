import { types } from "mobx-state-tree";

export const UIModel = types
  .model("UI", {
    showInvestigationModalSelect: false,
    showInvestigationPanel: false,
    showPopulationGraph: false
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
      }
    };
  });

export type UIModelType = typeof UIModel.Type;
