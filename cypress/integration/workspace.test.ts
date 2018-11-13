context("Test Default Conditions", () => {

  before(() => {
    cy.visit("");
  });

  describe("Desktop functionalities", () => {

    it("renders with text", () => {
      cy.get('.app-container').should('exist');
      cy.get('.nav-and-content-container').should('exist');
    });
  });

  describe("Left Nav content and functionality", () => {

    it("verifies connected-bio logo is present", () => {
      cy.get('[data-test=top-bar-img]').should('be.visible')
    });

    it('verifies title is present', () => {
      cy.get('[data-test=top-bar-title]').should('be.visible')
    })

    it("verifies investigate navigation functionality", () => {
      cy.get('[data-test=investigate-select-button]').click()
      cy.get('[data-test=investigate-dialog-message]').should('be.visible');
    });
  });
});
