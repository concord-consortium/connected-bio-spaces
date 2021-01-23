context("Test Peas Unit UI", () => {
  describe("Top Bar", () => {
    it("should show 'Peas'", () => {
      const params = encodeURIComponent(JSON.stringify({unit: "pea", topBar: true}));
      cy.visit(`/?${params}`);
      cy.get(".top-bar").should("be.visible")
        .and("contain", "Peas");
    });
  });

  describe("Breeding space", () => {
    it("should show correct title", () => {
      const authoring = {
        unit: "pea",
        ui: {
          investigationPanelSpace: "breeding"
        }
      };
      const params = encodeURIComponent(JSON.stringify(authoring));
      cy.visit(`/?${params}`);
      cy.get(".header .title").should("be.visible")
        .and("contain", "Greenhouse");
    });
  });
});
