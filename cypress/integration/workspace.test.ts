context("Test the overall app", () => {
  before(() => {
    cy.visit("");
  });

  describe("Desktop functionalities", () => {
    it("renders with text", () => {
      cy.get(".app-container").should("exist");
      cy.get(".nav-and-content-container").should("exist");
    });
  });
});
