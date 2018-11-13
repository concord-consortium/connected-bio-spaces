class InvestigateDialog {

  getInvestigateDialogTitle() {
    cy.get('[data-test=investigate-dialog-title]');
  }

  getInvestigatedialogMessage() {
    cy.get('[data-test=investigate-dialog-title]');
  }

  getInvestigateOptionPopulation() {
    cy.get('[data-test=investigate-option-population]');
  }

  getInvestigateOptionBreeding() {
    cy.get('[data-test=investigate-option-breeding]');
  }

  getInvestigateOptionScopeZoom() {
    cy.get('[data-test=investigate-option-scope-zoom]');
  }

  getInvestigateOptionProtein() {
    cy.get('[data-test=investigate-option-protein]');
  }

  getInvestigateOptionComparison() {
    cy.get('[data-test=investigate-option-comparison]');
  }
}
