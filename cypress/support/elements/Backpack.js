class Backpack{

  getEmptyCollectButton() {
    return cy.get('.left-nav-panel  [data-test=empty-button]')
  }

  getFullCollectButton() {
    return cy.get('.left-nav-panel  [data-test=stored-mouse-class]')
  }

  getLegendComponents() {
    return cy.get('.left-nav-panel .grid-item')
  }

  findXClose(index){
    return cy.get('.left-nav-panel  [data-test=x-close-backpack]').eq(index)
  }

}
export default Backpack;
