context("Test the authoring page", () => {
  beforeEach(() => {
    cy.visit("/?authoring", {
      onBeforeLoad(win) {
        cy.stub(win, "open").as("windowOpen");
      }
    });
  });

  describe("Generated URL", () => {
    it("contains default parameters", () => {
      cy.contains("Submit").click();

      const topBarParam = encodeURIComponent(`"topBar":true`);
      cy.get("@windowOpen").should("be.calledWithMatch", topBarParam);
    });

    it("contains updated parameters", () => {
      cy.contains("Top Bar").click();
      cy.contains("Submit").click();

      const topBarParam = encodeURIComponent(`"topBar":false`);
      cy.get("@windowOpen").should("be.calledWithMatch", topBarParam);
    });
  });
});
