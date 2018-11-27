import { UIModel, UIModelType, SpaceTypeEnum } from "./ui";

describe("ui model", () => {
  let ui: UIModelType;

  beforeEach(() => {
    ui = UIModel.create({
      investigationPanelSpace: "none"
    });
  });

  it("has default values", () => {
    expect(ui.showPopulationGraph).toBe(false);
    expect(ui.investigationPanelSpace).toBe("none");
  });

  it("uses override values", () => {
    ui = UIModel.create({
      showPopulationGraph: true,
      investigationPanelSpace: "populations"
    });
    expect(ui.showPopulationGraph).toBe(true);
    expect(ui.investigationPanelSpace).toBe("populations");
  });

  it("sets new values", () => {
    ui.setShowPopulationGraph(true);
    expect(ui.showPopulationGraph).toBe(true);
  });

});
