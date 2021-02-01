context("Test URL parameters", () => {
  describe("Top Bar", () => {
    it("is visible by default", () => {
      cy.visit("");
      cy.get(".top-bar").should("be.visible");
    });

    it("is hidden when specified", () => {
      const hideParams = encodeURIComponent(JSON.stringify({topBar: false}));
      cy.visit(`/?${hideParams}`);
      cy.get(".top-bar").should("not.be.visible");
    });

    it("is visible when specified", () => {
      const showParams = encodeURIComponent(JSON.stringify({topBar: true}));
      cy.visit(`/?${showParams}`);
      cy.get(".top-bar").should("be.visible");
    });
  });

  describe("Left column", () => {
    it("is visible by default", () => {
      cy.visit("");
      cy.get(".left-nav-panel").should("be.visible");
    });

    it("is hidden when specified", () => {
      const hideParams = encodeURIComponent(JSON.stringify({leftPanel: false}));
      cy.visit(`/?${hideParams}`);
      cy.get(".left-nav-panel").should("not.be.visible");
    });

    it("is visible when specified", () => {
      const showParams = encodeURIComponent(JSON.stringify({leftPanel: true}));
      cy.visit(`/?${showParams}`);
      cy.get(".left-nav-panel").should("be.visible");
    });
  });
});
