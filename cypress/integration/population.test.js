import Backpack from './elements/Backpack'
import ExploreNav from './elements/ExploreNav'
import Pop from './elements/pop'
import TwoUpView from './elements/TwoUpView'
import FourUpView from './elements/FourUpView'

context("Test the population level", () => {

  let backpack = new Backpack;
  let exploreNav = new ExploreNav;
  let pop = new Pop;
  let twoUpView = new TwoUpView;
  let fourUpView = new FourUpView;

  beforeEach(function () {
    cy.visit('/')
    exploreNav.getExploreView('population').click();
  })

  context("Two Up View", () => {
    it('exits two up view/population model and returns', () => {
      exploreNav.getExploreView('organism').click();
      fourUpView.getFourUpView().should('be.visible')
      exploreNav.getExploreView('population').click();
    });
  });

  context("Tools", () => {
    it("runs, resets, and adds hawks to model", () => {
      twoUpView.getTwoUpView().should('be.visible')
      pop.getPopTool('run').click({force:true}); //run
      pop.getPopTool('reset').click({force:true}); //reset
      pop.getPopTool('addHawks').click({force:true}); //add hawks
    });
    it('runs model after pausing and changing environment', () => {
      pop.getPopTool('run').click({force:true});
      pop.getPopTool('changeEnv').click({force:true});
      pop.getPopTool('changeEnv').click({force:true});
      pop.getPopTool('pause').click({force:true});
      pop.getPopTool('addHawks').click({force:true});
    });
    it("verifies switching to and from Pop view renders correct window", () => {
      exploreNav.getExploreView('organism').click({force:true});
      exploreNav.getExploreView('population').click({force:true});
      exploreNav.getExploreView('organism').click({force:true});
      exploreNav.getExploreView('population').click({force:true});
      exploreNav.getExploreView('organism').click({force:true});
      exploreNav.getExploreView('population').click({force:true});
      exploreNav.getExploreView('organism').click({force:true});
      exploreNav.getExploreView('population').click({force:true});
    });
  });

});
