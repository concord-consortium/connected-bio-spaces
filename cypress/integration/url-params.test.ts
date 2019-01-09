context("Test URL parameters", () => {
  describe("Top Bar", () => {
    it("is visible by default", () => {
      cy.visit("");
      cy.get(".top-bar").should("exist");
    });

    it("is hidden when specified", () => {
      const hideParams = encodeURIComponent(JSON.stringify({topBar: false}));
      cy.visit(`/?${hideParams}`);
      cy.get(".top-bar").should("not.exist");
    });

    it("is visible when specified", () => {
      const showParams = encodeURIComponent(JSON.stringify({topBar: true}));
      cy.visit(`/?${showParams}`);
      cy.get(".top-bar").should("exist");
    });
  });

  describe("Explore: Population Space", () => {
    it("is visible by default", () => {
      cy.visit("");
      cy.get(".explore-button.populations.clickable").should("exist");
    });

    it("is hidden when specified", () => {
      const hideParams = encodeURIComponent(JSON.stringify({showPopulationSpace: false}));
      cy.visit(`/?${hideParams}`);
      cy.get(".explore-button.populations.clickable").should("not.be.visible");
    });

    it("is visible when specified", () => {
      const showParams = encodeURIComponent(JSON.stringify({showPopulationSpace: true}));
      cy.visit(`/?${showParams}`);
      cy.get(".explore-button.populations.clickable").should("exist");
    });
  });
});
