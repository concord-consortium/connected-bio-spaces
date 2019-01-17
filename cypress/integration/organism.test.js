import Backpack from './elements/Backpack'
import ExploreNav from './elements/ExploreNav'
import Pop from './elements/Pop'
import Org from './elements/Org'
import TwoUpView from './elements/TwoUpView'
import FourUpView from './elements/FourUpView'
import RightPanelContentFourUp from './elements/RightPanelContentFourUp'

context("Test Organism Level", () => {

  let backpack = new Backpack;
  let exploreNav = new ExploreNav;
  let pop = new Pop;
  let org = new Org;
  let twoUpView = new TwoUpView;
  let fourUpView = new FourUpView;
  let rightPanelContentFourUp = new RightPanelContentFourUp;

  beforeEach(function () {
    cy.visit('/')
    exploreNav.getExploreView('population').click({force:true})
    pop.getPopTool('collect').click({force:true})
    pop.getPopTool('canvas').click('topLeft')
    pop.getPopTool('canvas').click('top')
    pop.getPopTool('canvas').click('topRight')
    pop.getPopTool('canvas').click('left')
    pop.getPopTool('canvas').click('center')
    pop.getPopTool('canvas').click('right')
    pop.getPopTool('canvas').click('bottomLeft')
    pop.getPopTool('canvas').click('bottom')
    pop.getPopTool('canvas').click('bottomRight')
    backpack.getFullCollectButton().should('be.visible')
    exploreNav.getExploreView('organism').click({force:true})
  })

  context("Four Up View", () => {
    it("switches out of view and returns", () => {
      exploreNav.getExploreView('population').click({force:true})
      fourUpView.getFourUpView()
        .should('not.exist')
      exploreNav.getExploreView('organism').click({force:true})
      fourUpView.getFourUpView()
        .should('exist')
        .and('be.visible')
    });
  });

  context("Right Panel", () => {
    it("checks right panel default for tabs, titles, content", () => {
      rightPanelContentFourUp.getTitleFourUpTop()
        .contains('Instructions')
      rightPanelContentFourUp.getDataTabFourUpTop()
        .should('be.visible')
        .click({force:true})
      rightPanelContentFourUp.getTitleFourUpTop()
        .contains('Data')
      rightPanelContentFourUp.getInformationTabFourUpTop()
        .should('be.visible')
        .click({force:true})
      rightPanelContentFourUp.getTitleFourUpTop()
        .contains('Information')
      rightPanelContentFourUp.getContentFourUpTop()
        .contains('Find and inspect a protein to view it here.')
    })
    it("adds a mouse to the model", () => {
      org.getOrganismView('top')
        .should('not.exist')
      backpack.getFullCollectButton().eq(0)
        .should('be.visible')
        .click({force:true})
      org.getOrgTool('top','mouse-empty')
        .should('be.visible')
        .click({force:true})
      org.getOrganismView('top')
        .should('exist')
      backpack.findXClose(0)
        .should('be.visible')
        .click({force:true})
      org.getOrganismView('top')
        .should('exist')
      })
    })
  });
