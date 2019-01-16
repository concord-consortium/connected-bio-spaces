class Backpack{

  getEmptyCollectButton() {
    return cy.get('[data-test=empty-button]')
  }

  getFullCollectButton() {
    return cy.get('[data-test=stored-mouse-class]')
  }

  findXClose(index){
    return cy.get('.collect-button-holder').eq(index).find('.x-close')
  }
}
export default Backpack;
