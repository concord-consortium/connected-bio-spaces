import Backpack from './elements/Backpack'
import ExploreNav from './elements/ExploreNav'
import PopToolBar from './elements/PopToolBar'
import TwoUpView from './elements/TwoUpView'
import FourUpView from './elements/FourUpView'

context("Test the population level", () => {

  let backpack = new Backpack;
  let exploreNav = new ExploreNav;
  let popToolBar = new PopToolBar;
  let twoUpView = new TwoUpView;
  let fourUpView = new FourUpView;

  context("Two Up View", () => {
    it("verifies two up view is visible", () => {
      cy.visit("/")
      exploreNav.getExploreView('population').click();
      twoUpView.getTwoUpDisplay().should('be.visible')
      twoUpView.getLeftTitle().should('be.visible')
      twoUpView.getRightTitle().should('be.visible')
    });

    it('exits two up view/population model and returns', () => {
      exploreNav.getExploreView('organism').click();
      fourUpView.getFourUpView().should('be.visible')
    });

  });

  context("Tools", () => {

    it("runs, resets, and adds hawks to model", () => {
      cy.visit('/')
      exploreNav.getExploreView('population').click();
      twoUpView.getTwoUpDisplay().should('be.visible')
      popToolBar.getPopTool('run').click({force:true}); //run
      popToolBar.getPopTool('reset').click({force:true}); //reset
      popToolBar.getPopTool('addHawks').click({force:true}); //add hawks
    });

    it('runs model after pausing and changing environment', () => {
      popToolBar.getPopTool('run').click({force:true});
      popToolBar.getPopTool('changeEnv').click({force:true});
      popToolBar.getPopTool('changeEnv').click({force:true});
      popToolBar.getPopTool('pause').click({force:true});
      popToolBar.getPopTool('addHawks').click({force:true});
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

  context("Backpack Empty", () => {

    it("is visible by default", () => {
      cy.visit("/")
      cy.get('div.button-holder.collect').find('img').should('have.length', 6);
      cy.get('div.button-holder.collect').find('img').eq(1).should('have.class', 'icon')
    });
  });

  context("Backpack Populated", () => {
    it('modifies seed data', () => {

     })

    it("removes a mouse from the backpack", () => {

    });

    it("attempts to add more than 6 mice to backpack", () => {

    });
  });

  context("Graph", () => {
    it("is visible by default", () => {

    });

    it("verifies the legend shows correctly", () => {

    });
  });

});
