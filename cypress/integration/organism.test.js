import Backpack from './elements/Backpack'
import ExploreNav from './elements/ExploreNav'
import PopToolBar from './elements/PopToolBar'
import OrgToolBar from './elements/OrgToolBar'
import TwoUpView from './elements/TwoUpView'
import FourUpView from './elements/FourUpView'
import RightPanelContentFourUp from './elements/RightPanelContentFourUp'

context("Test the organism level", () => {

  let backpack = new Backpack;
  let exploreNav = new ExploreNav;
  let popToolBar = new PopToolBar;
  let orgToolBar = new OrgToolBar;
  let twoUpView = new TwoUpView;
  let fourUpView = new FourUpView;
  let rightPanelContentFourUp = new RightPanelContentFourUp;

  before(function () {
  cy.visit('/')
  exploreNav.getExploreView('population').click({force:true})
  popToolBar.getPopTool('collect').click({force:true})
  popToolBar.getPopTool('canvas').click('left')
  popToolBar.getPopTool('canvas').click('center')
  popToolBar.getPopTool('canvas').click('right')
  backpack.getFullCollectButton().should('be.visible')
  exploreNav.getExploreView('organism').click({force:true})
})

  describe("Four Up View", () => {
    it("verifies four up view is visible", () => {
      fourUpView.getFourUpView().should('be.visible')
      twoUpView.getTwoUpView()
        .should('have.length', 2)
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
    });
  });
});
