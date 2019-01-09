class Backpack{

  getEmptyCollectButton() {
    return cy.get('[data-test=empty-button]')
  }

  getFullCollectButton() {
    return cy.get('[data-test=stored-mouse-class]')
  }

  findXClose(){
    return cy.get('[data-test=x-close-backpack]')
  }
}
export default Backpack;
