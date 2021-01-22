context("Test Deer Mice Unit UI", () => {
  describe("Top Bar", () => {
    it("should show 'Deer Mice'", () => {
      const params = encodeURIComponent(JSON.stringify({unit: "mouse", topBar: true}));
      cy.visit(`/?${params}`);
      cy.get(".top-bar").should("be.visible")
        .and("contain", "Deer Mice");
    });
  });

  describe("Breeding space", () => {
    it("should show correct title", () => {
      const authoring = {
        unit: "mouse",
        ui: {
          investigationPanelSpace: "breeding"
        }
      };
      const params = encodeURIComponent(JSON.stringify(authoring));
      cy.visit(`/?${params}`);
      cy.get(".header .title").should("be.visible")
        .and("contain", "Explore: Nesting Pairs");
    });
  });
});
