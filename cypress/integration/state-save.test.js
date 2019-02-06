import Backpack from '../support/elements/Backpack'
import ExploreNav from '../support/elements/ExploreNav'

context('State Saving', () => {
    before(function() {
        cy.visit('http://authoring.concord.org/activities/9366/pages/121052')
    })

    let backpack = new Backpack;
    let exploreNav = new ExploreNav;

    it('gets the iframe', ()=>{
        cy.getCBioIframe().should('exist');
        cy.log(JSON.stringify(cy.getCBioIframe()));
    })
    it('loads the page', () => {
        debugger
        cy.getCBioIframe().find(backpack.getEmptyCollectButton()).should('have.length', '6');
    });

})