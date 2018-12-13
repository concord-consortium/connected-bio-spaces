import { UIModel, UIModelType, SpaceTypeEnum } from "./ui";

describe("ui model", () => {
  let ui: UIModelType;

  beforeEach(() => {
    ui = UIModel.create({
      investigationPanelSpace: "none"
    });
  });

  it("has default values", () => {
    expect(ui.investigationPanelSpace).toBe("none");
    expect(ui.availableBackpackSlots).toBe(6);
  });

  it("uses override values", () => {
    ui = UIModel.create({
      investigationPanelSpace: "populations"
    });
    expect(ui.investigationPanelSpace).toBe("populations");
  });

  it("sets new values", () => {
    ui.setInvestigationPanelSpace("organism");
    expect(ui.investigationPanelSpace).toBe("organism");
  });

});
