import Backpack from '../support/elements/Backpack'
import ExploreNav from '../support/elements/ExploreNav'
import Pop from '../support/elements/Pop'
import Org from '../support/elements/Org'
import TwoUpView from '../support/elements/TwoUpView'
import FourUpView from '../support/elements/FourUpView'
import RightPanelContentFourUp from '../support/elements/RightPanelContentFourUp'

context("Test Organism Level", () => {

  let backpack = new Backpack;
  let exploreNav = new ExploreNav;
  let pop = new Pop;
  let org = new Org;
  let twoUpView = new TwoUpView;
  let fourUpView = new FourUpView;
  let rightPanelContentFourUp = new RightPanelContentFourUp;

  beforeEach(function () {
    cy.visit('/?{"backpack":{"collectedMice":[{"sex":"female","genotype":"RR"}]}}')
    exploreNav.getExploreView('populations').click({ force: true })
    pop.getPopTool('collect').click({ force: true })
    pop.getPopTool('canvas').click('topLeft', { force: true })
    pop.getPopTool('canvas').click('top', { force: true })
    pop.getPopTool('canvas').click('topRight', { force: true })
    pop.getPopTool('canvas').click('left', { force: true })
    pop.getPopTool('canvas').click('center', { force: true })
    pop.getPopTool('canvas').click('right', { force: true })
    pop.getPopTool('canvas').click('bottomLeft', { force: true })
    pop.getPopTool('canvas').click('bottom', { force: true })
    pop.getPopTool('canvas').click('bottomRight', { force: true })
    backpack.getFullCollectButton().should('be.visible')
    exploreNav.getExploreView('organism').click({ force: true })
  })

  context("Four Up View", () => {
    it("switches out of view and returns", () => {
      exploreNav.getExploreView('populations').click({ force: true })
      fourUpView.getFourUpDisplay().should('not.exist')
      exploreNav.getExploreView('organism').click({ force: true })
      fourUpView.getFourUpDisplay().should('exist').and('be.visible')
    });
  });

  context("Right Panel", () => {
    it("checks right panel default for tabs, titles, content", () => {
      rightPanelContentFourUp.getFourUp('top').within(() => {
        rightPanelContentFourUp.getRightHeaderTabs().should('have.length', 3)
        rightPanelContentFourUp.getTitle().should('contain', 'Instructions')
        rightPanelContentFourUp.getRightHeaderTabs().eq(1).click()
      })
      rightPanelContentFourUp.getFourUp('top').within(() => {
        rightPanelContentFourUp.getTitle().should('contain', 'Data')
        rightPanelContentFourUp.getRightHeaderTabs().eq(2).click()
      })
      rightPanelContentFourUp.getFourUp('top').within(() => {
        rightPanelContentFourUp.getTitle().should('contain', 'Information')
      })

      // rightPanelContentFourUp.getTitle('top').contains('Data')
      // rightPanelContentFourUp.getTab('top','Information').should('be.visible').click({force:true})
      // rightPanelContentFourUp.getTitle('top').contains('Information')
      // rightPanelContentFourUp.getContent().contains('Find and inspect a protein to view it here.')
    })
    it("adds a mouse to the model", () => {
      org.getOrganismView('top').should('exist')
      backpack.getFullCollectButton().eq(0).should('be.visible').click({ force: true })
      org.getOrgTool('mouse-full').should('be.visible').should('have.length', 1)
      org.getOrganismView('top').should('exist')
    })
  })
});
