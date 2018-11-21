import { types } from "mobx-state-tree";

export type Space = "populations" | "breeding" | "organism" | "dna" | "none";

export const UIModel = types
  .model("UI", {
    showPopulationGraph: false,
    investigationPanelSpace: "none",
    availableBackpackSlots: 6
  })
  .actions((self) => {
    return {
      setShowPopulationGraph(val: boolean) {
        self.showPopulationGraph = val;
      },
      setInvestigationPanelSpace(space: Space) {
        self.investigationPanelSpace = space;
      },
      setAvailableBackpackSlots(val: number) {
        self.availableBackpackSlots = val;
      }
    };
  });

export type UIModelType = typeof UIModel.Type;
