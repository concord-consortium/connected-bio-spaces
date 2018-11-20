import { UIModel, UIModelType } from "./ui";

describe("ui model", () => {
  let ui: UIModelType;

  beforeEach(() => {
    ui = UIModel.create({});
  });

  it("has default values", () => {
    expect(ui.showPopulationGraph).toBe(false);
    expect(ui.investigationPanelSpace).toBe("none");
    expect(ui.availableBackpackSlots).toBe(6);
  });

  it("uses override values", () => {
    ui = UIModel.create({
      showPopulationGraph: true,
      availableBackpackSlots: 5
    });
    expect(ui.showPopulationGraph).toBe(true);
    expect(ui.availableBackpackSlots).toBe(5);
  });

  it("sets new values", () => {
    ui.setShowPopulationGraph(true);
    expect(ui.showPopulationGraph).toBe(true);
    ui.setAvailableBackpackSlots(5);
    expect(ui.availableBackpackSlots).toBe(5);
  });

});
