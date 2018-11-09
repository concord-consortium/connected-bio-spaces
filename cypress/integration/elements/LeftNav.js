class LeftNav {

  getBackpack() {
    return cy.get('[data-test=backpack]');
  }

  getBackpackElements() {
    return cy.get('[data-test=backpack-items]');
  }

  getInvestigateSelect() {
    return cy.get('[data-test=investigate-select-button]')
  }

}
