import { types } from "mobx-state-tree";

export const UIModel = types
  .model("UI", {
    sampleText: "Hello World",
    showInvestigationModalSelect: false,
    showInvestigationPanel: false
  })
  .actions((self) => {
    return {
      setSampleText(text: string) {
        self.sampleText = text;
      },
      setShowInvestigationModalSelect(val: boolean) {
        self.showInvestigationModalSelect = val;
      },
      setShowInvestigationPanel(val: boolean) {
        self.showInvestigationPanel = val;
      }
    };
  });

export type UIModelType = typeof UIModel.Type;
