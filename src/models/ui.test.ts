import { UIModel, UIModelType, SpaceTypeEnum } from "./ui";

describe("ui model", () => {
  let ui: UIModelType;

  beforeEach(() => {
    ui = UIModel.create({
      investigationPanelSpace: "none",
      populationsRightPanel: "instructions",
      organismRightPanel: ["instructions", "data"]
    });
  });

  it("has default values", () => {
    expect(ui.investigationPanelSpace).toBe("none");
    expect(ui.populationsRightPanel).toBe("instructions");
    expect(ui.availableBackpackSlots).toBe(6);
  });

  it("uses override values", () => {
    ui = UIModel.create({
      populationsRightPanel: "data",
      investigationPanelSpace: "populations"
    });
    expect(ui.populationsRightPanel).toBe("data");
    expect(ui.investigationPanelSpace).toBe("populations");
  });

  it("sets new values", () => {
    ui.setPopulationRightPanel("information");
    expect(ui.populationsRightPanel).toBe("information");
  });

});
