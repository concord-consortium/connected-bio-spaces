import { UIModel, UIModelType } from "./ui";

describe("ui model", () => {
  let ui: UIModelType;

  beforeEach(() => {
    ui = UIModel.create({});
  });

  it("has default values", () => {
    expect(ui.showInvestigationModalSelect).toBe(false);
    expect(ui.showInvestigationPanel).toBe(false);
    expect(ui.showPopulationGraph).toBe(false);
    expect(ui.investigationPanelSpace).toBe("populations");
    expect(ui.availableBackpackSlots).toBe(6);
  });

  it("uses override values", () => {
    ui = UIModel.create({
      showInvestigationModalSelect: true,
      showInvestigationPanel: true,
      showPopulationGraph: true,
      availableBackpackSlots: 5
    });
    expect(ui.showInvestigationModalSelect).toBe(true);
    expect(ui.showInvestigationPanel).toBe(true);
    expect(ui.showPopulationGraph).toBe(true);
    expect(ui.availableBackpackSlots).toBe(5);
  });

  it("sets new values", () => {
    ui.setShowInvestigationModalSelect(true);
    expect(ui.showInvestigationModalSelect).toBe(true);
    ui.setShowInvestigationPanel(true);
    expect(ui.showInvestigationPanel).toBe(true);
    ui.setShowPopulationGraph(true);
    expect(ui.showPopulationGraph).toBe(true);
    ui.setAvailableBackpackSlots(5);
    expect(ui.availableBackpackSlots).toBe(5);
  });

});
