class PopToolBar{

  getPopToolBar() {
    return cy.get('[data-test=pop-toolbar]')
  }

  getPopTool(tool) {
    switch(tool){
      case('run'):
        return cy.get('[data-test=pop-toolbar]').find('button').eq(0)
      case('pause'):
        return cy.get('[data-test=pop-toolbar]').find('button').eq(0)
      case('addHawks'):
        return cy.get('[data-test=pop-toolbar]').find('button').eq(1)
      case('changeEnv'):
        return cy.get('[data-test=pop-toolbar]').find('button').eq(2)
      case('inspect'):
        return cy.get('[data-test=pop-toolbar]').find('button').eq(3)
      case('collect'):
        return cy.get('[data-test=pop-toolbar]').find('button').eq(4)
      case('reset'):
        return cy.get('[data-test=pop-toolbar]').find('button').eq(5)
    }
  }
}
export default PopToolBar;
