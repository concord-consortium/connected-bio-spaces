class RightPanelContent {

  getInstructionsTab() {
    return cy.get("[data-test=two-up-display] > .left-abutment > [data-test=right-header] > :nth-child(1)");
  }

  getDataTab() {
    return cy.get("[data-test=two-up-display] > .left-abutment > [data-test=right-header] > :nth-child(2)");
  }

  getInformation() {
    return cy.get("[data-test=two-up-display] > .left-abutment > [data-test=right-header] > :nth-child(3)");
  }

  getHighlightedTab() {
    return cy.get("[data-test=two-up-display] > .left-abutment > [data-test=right-header] > .active")
  }

  getTitle() {
    return cy.get("[data-test=two-up-display] > .left-abutment > [data-test=right-header] > [data-test=right-title]")
  }

  getContent() {
    return cy.get("[data-test=two-up-display] > .left-abutment > [data-test=right-content]")
  }

}
export default RightPanelContentFourUp;
