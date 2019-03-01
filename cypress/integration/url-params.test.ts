import ExploreNav from '../support/elements/ExploreNav'

context("Test URL parameters", () => {

let exploreNav = new ExploreNav;

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
    it("is visible when specified", () => {
     const hideParams = encodeURIComponent(JSON.stringify({spaces:{showPopulationSpace: false}}));
     cy.visit(`/?${hideParams}`);
      // cy.visit('/?{"spaces":{"showPopulationSpace": false}}')
      //exploreNav.getExploreView('population')
        //.should('not.be.visible')
      });

  });

});
