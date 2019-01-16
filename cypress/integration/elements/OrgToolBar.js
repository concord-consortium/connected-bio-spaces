class OrgToolBar{

  getOrgToolBar() {
    return cy.get('')
  }

  getOrgTool(position, tool) {
    switch(position) {
        case('top'):
          { switch(tool) {
              case('zoom-in'):
                return cy.get('[data-test=four-up-top] > [data-test=two-up-display] > [data-test=left-panel] > [data-test=left-content] > [data-test=organism-view-container] > .organism-controls > [data-test=zoom-control-container] > [data-test=zoom-in]')
              case('zoom-out'):
                return cy.get('[data-test=four-up-top] > [data-test=two-up-display] > [data-test=left-panel] > [data-test=left-content] > [data-test=organism-view-container] > .organism-controls > [data-test=zoom-control-container] > [data-test=zoom-out]')
              case('measure'):
                return cy.get('[data-test=four-up-top] > [data-test=measure]')
              case('inspect'):
                return cy.get('[data-test=four-up-top] > [data-test=inspect]')
              case('add-substance'):
                return cy.get('[data-test=four-up-top] > [data-test=add-substance]')
              case('substance-list'):
                return cy.get('[data-test=four-up-top] > [data-test=two-up-display] > [data-test=left-panel] > [data-test=left-content] > [data-test=organism-view-container] > .organism-controls > [data-test=manipulations-panel] > .select')
            }
          }
        case('bottom'):
          { switch(tool) {
              case('zoom-in'):
                return cy.get('[data-test=four-up-bottom] > [data-test=two-up-display] > [data-test=left-panel] > [data-test=left-content] > [data-test=organism-view-container] > .organism-controls > [data-test=zoom-control-container] > [data-test=zoom-in]')
              case('zoom-out'):
                return cy.get('[data-test=four-up-bottom] > [data-test=two-up-display] > [data-test=left-panel] > [data-test=left-content] > [data-test=organism-view-container] > .organism-controls > [data-test=zoom-control-container] > [data-test=zoom-out]')
              case('measure'):
                return cy.get('[data-test=four-up-bottom] > [data-test=measure]')
              case('inspect'):
                return cy.get('[data-test=four-up-bottom] > [data-test=inspect]')
              case('add-substance'):
                return cy.get('[data-test=four-up-bottom] > [data-test=add-substance]')
              case('substance-list'):
                return cy.get('[data-test=four-up-bottom] > [data-test=two-up-display] > [data-test=left-panel] > [data-test=left-content] > [data-test=organism-view-container] > .organism-controls > [data-test=manipulations-panel] > .select')
          }
        }
      }
    }
}
export default OrgToolBar;
