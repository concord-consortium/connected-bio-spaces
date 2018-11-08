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
  });

  it("uses override values", () => {
    ui = UIModel.create({
      showInvestigationModalSelect: true,
      showInvestigationPanel: true,
      showPopulationGraph: true
    });
    expect(ui.showInvestigationModalSelect).toBe(true);
    expect(ui.showInvestigationPanel).toBe(true);
    expect(ui.showPopulationGraph).toBe(true);
  });

  it("sets new values", () => {
    ui.setShowInvestigationModalSelect(true);
    expect(ui.showInvestigationModalSelect).toBe(true);
    ui.setShowInvestigationPanel(true);
    expect(ui.showInvestigationPanel).toBe(true);
    ui.setShowPopulationGraph(true);
    expect(ui.showPopulationGraph).toBe(true);
  });

});
