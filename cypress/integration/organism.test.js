context("Test the organism view", () => {
  describe("Four Up View", () => {
    it("verifies four up view is visible", () => {
      cy.visit("/")
      cy.get("div.icon.organism.clickable").click();
      cy.wait(1000);
      cy.get("[data-test=four-up-display]").should("be.visible");
    });

  });

  describe("Investigation panel", () => {
    it("checks that panel is empty to begin", () => {

    });

    it('brings mouse from backpack into one of two left panels', () => {

    });

    it('adds a randomly generated mouse to left panel', () => {

    });

    it("zooms into cell view", () => {

    });

    it("clicks on cell view to populate graph", () => {

    });

    it('adds a new mouse to second panel', () => {

    });

  });

  describe("Zoom Button", () => {
    it("zooms in to maximum view", () => {

    });

    it('zooms out to minimum view', () => {

    });

    it('adds a randomly generated mouse to left panel', () => {

    });

  });
});
