context("Test URL parameters", () => {
  describe("Top Bar", () => {
    it("is visible by default", () => {
      cy.visit("");
      cy.get(".top-bar").should("be.visible");
    });

    it("is hidden when specified", () => {
      const hideParams = encodeURIComponent(JSON.stringify({topBar: false}));
      cy.visit(`/?${hideParams}`);
      cy.get(".top-bar").should("not.exist");
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
      cy.get(".left-nav-panel").should("not.exist");
    });

    it("is visible when specified", () => {
      const showParams = encodeURIComponent(JSON.stringify({leftPanel: true}));
      cy.visit(`/?${showParams}`);
      cy.get(".left-nav-panel").should("be.visible");
    });

    it("is visible makes Collect button visible", () => {
      const hideParamsBreeding = encodeURIComponent(JSON.stringify({
        leftPanel: true,
        ui: {investigationPanelSpace: "breeding"}
      }));
      cy.visit(`/?${hideParamsBreeding}`);
      cy.get("[data-test=breed-toolbar-main-buttons")
        .find(".breeding-button").should("have.length", 4);

      const hideParamsPopulations = encodeURIComponent(JSON.stringify({
        leftPanel: true,
        ui: {investigationPanelSpace: "populations"}
      }));
      cy.visit(`/?${hideParamsPopulations}`);
      cy.get("[data-test=pop-toolbar-main-buttons")
        .find(".population-button").should("have.length", 6);
    });

    it("is hidden makes Collect button hidden", () => {
      const hideParams = encodeURIComponent(JSON.stringify({
        leftPanel: false,
        ui: {investigationPanelSpace: "breeding"}
      }));
      cy.visit(`/?${hideParams}`);
      cy.get("[data-test=breed-toolbar-main-buttons")
        .find(".breeding-button").should("have.length", 3);

      const hideParamsPopulations = encodeURIComponent(JSON.stringify({
        leftPanel: false,
        ui: {investigationPanelSpace: "populations"}
      }));
      cy.visit(`/?${hideParamsPopulations}`);
      cy.get("[data-test=pop-toolbar-main-buttons")
        .find(".population-button").should("have.length", 5);
    });
  });
});
