class RightPanelContentFourUp {

  getInstructionsTabFourUpTop() {
    return cy.get("[data-test=four-up-top] > [data-test=two-up-display] > .left-abutment > [data-test=right-header] > :nth-child(1)");
  }

  getDataTabFourUpTop() {
    return cy.get("[data-test=four-up-top] > [data-test=two-up-display] > .left-abutment > [data-test=right-header] > :nth-child(2)");
  }

  getInformationTabFourUpTop() {
    return cy.get("[data-test=four-up-top] > [data-test=two-up-display] > .left-abutment > [data-test=right-header] > :nth-child(3)");
  }

  getHighlightedTabFourUpTop() {
    return cy.get("[data-test=four-up-top] > [data-test=two-up-display] > .left-abutment > [data-test=right-header] > .active")
  }

  getTitleFourUpTop() {
    return cy.get("[data-test=four-up-top] > [data-test=two-up-display] > .left-abutment > [data-test=right-header] > [data-test=right-title]")
  }

  getContentFourUpTop() {
    return cy.get("[data-test=four-up-top] > [data-test=two-up-display] > .left-abutment > [data-test=right-content]")
  }

  getInstructionsTabFourUpBottom() {
    return cy.get("[data-test=four-up-bottom] > [data-test=two-up-display] > .left-abutment > [data-test=right-header] > :nth-child(1)");
  }

  getDataTabFourUpBottom() {
    return cy.get("[data-test=four-up-bottom] > [data-test=two-up-display] > .left-abutment > [data-test=right-header] > :nth-child(2)");
  }

  getInformationTabFourUpBottom() {
    return cy.get("[data-test=four-up-bottom] > [data-test=two-up-display] > .left-abutment > [data-test=right-header] > :nth-child(3)");
  }

  getHighlightedTabFourUpBottom() {
    return cy.get("[data-test=four-up-bottom] > [data-test=two-up-display] > .left-abutment > [data-test=right-header] > .active")
  }

  getTitleFourUpBottom() {
    return cy.get("[data-test=four-up-bottom] > [data-test=two-up-display] > .left-abutment > [data-test=right-header] > [data-test=right-title]")
  }

  getContentFourUpBottom() {
    return cy.get("[data-test=four-up-bottom] > [data-test=two-up-display] > .left-abutment > [data-test=right-content]")
  }
}
export default RightPanelContentFourUp;
