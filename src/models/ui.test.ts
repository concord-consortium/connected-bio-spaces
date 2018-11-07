import { UIModel, UIModelType } from "./ui";

describe("ui model", () => {
  let ui: UIModelType;

  beforeEach(() => {
    ui = UIModel.create({});
  });

  it("has default values", () => {
		expect(ui.showInvestigationModalSelect).toBe(false);
		expect(ui.showInvestigationPanel).toBe(false);
  });

  it("uses override values", () => {
    ui = UIModel.create({
			showInvestigationModalSelect: true,
			showInvestigationPanel: true
    });
		expect(ui.showInvestigationModalSelect).toBe(true);
		expect(ui.showInvestigationPanel).toBe(true);		
  });

  it("sets new values", () => {
		ui.setShowInvestigationModalSelect(true);
		expect(ui.showInvestigationModalSelect).toBe(true);
		ui.setShowInvestigationPanel(true);
		expect(ui.showInvestigationPanel).toBe(true);		
  });

});
