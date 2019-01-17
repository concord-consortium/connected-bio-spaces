import Backpack from './elements/Backpack'
import ExploreNav from './elements/ExploreNav'
import Pop from './elements/Pop'
import Org from './elements/Org'
import TwoUpView from './elements/TwoUpView'
import FourUpView from './elements/FourUpView'
import RightPanelContentFourUp from './elements/RightPanelContentFourUp'

context("Connected Bio Smoke Test", () => {

  let backpack = new Backpack;
  let exploreNav = new ExploreNav;
  let pop = new Pop;
  let org = new Org;
  let twoUpView = new TwoUpView;
  let fourUpView = new FourUpView;
  let rightPanelContentFourUp = new RightPanelContentFourUp;

  before(function () {
    cy.visit('/')
  })

  context("Default Display", () => {
    it('verifies no content', () => {
      cy.get('.main-content.none').should('be.visible')
    })
  })

  context("Left Nav", () => {
    it('verifies no content', () => {
      exploreNav.getExploreView('population')
        .should('be.visible');
      exploreNav.getExploreView('breeding')
        .should('be.visible')
      exploreNav.getExploreView('organism')
        .should('be.visible')
      exploreNav.getExploreView('dna')
        .should('be.visible')
    })
    it('verifies all 6 empty mouse collectors', () => {
      backpack.getEmptyCollectButton()
        .should('be.visible')
        .and('have.length', 6)
    })
    it('verifies legend components are visible', () => {
      backpack.getLegendComponents()
        .should('be.visible')
        .and('have.length', 3)
    })
  })

  context("Population model", () => {
    it('checks for two-up view', () => {
      exploreNav.getExploreView('population')
        .should('be.visible')
        .click({force:true})
      twoUpView.getTwoUpView()
        .should('be.visible')
        .and('have.length', 1)
    })

    it('checks for left and right headers', () => {
      twoUpView.getLeftTitle()
        .should('contain', 'Explore: Population')
      twoUpView.getRightTitle()
        .should('contain', 'Instructions')
    })

    it('runs, resets, and adds hawks to model', () => {
      pop.getPopTool('addHawks')
        .should('be.visible')
        .click({force:true});
      pop.getPopTool('run')
        .should('be.visible')
        .click({force:true});
      pop.getPopTool('reset')
        .should('be.visible')
        .click({force:true});
      })

    it('changes environment and runs again', () => {
      pop.getPopTool('changeEnv')
        .should('be.visible')
        .click({foce:true})
      pop.getPopTool('addHawks')
        .should('be.visible')
        .click({force:true});
      pop.getPopTool('run')
        .should('be.visible')
        .click({force:true});
      pop.getPopTool('reset')
        .should('be.visible')
        .click({force:true});
    })

    it('changes environment last time and runs again', () => {
      pop.getPopTool('changeEnv')
        .should('be.visible')
        .click({foce:true})
      pop.getPopTool('addHawks')
        .should('be.visible')
        .click({force:true});
      pop.getPopTool('run')
        .should('be.visible')
        .click({force:true});
      cy.wait(2000)
    })

/*  No way to detect inspection information since click is not conistent for mice
    it('inspects a mouse and verifies details', () => {
      pop.getPopTool('inspect').click({force:true})
      pop.getPopTool('canvas').click({force:true},'topLeft')
      pop.getPopTool('canvas').click({force:true},'top')
      pop.getPopTool('canvas').click({force:true},'topRight')
      pop.getPopTool('canvas').click({force:true},'left')
      pop.getPopTool('canvas').click({force:true},'center')
      pop.getPopTool('canvas').click({force:true},'right')
      pop.getPopTool('canvas').click({force:true},'bottomLeft')
      pop.getPopTool('canvas').click({force:true},'bottom')
      pop.getPopTool('canvas').click({force:true},'bottomRight')
    }) **/

    it('collects mice, checks backpack for update', () => {
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
      pop.getPopTool('reset').click({force:true})
      backpack.getFullCollectButton().should('be.visible')
    })

    it('toggles sex and heterozygote checkboxes', () => {

    })
  })

  context("Population and Graph", () => {
    it('check default tab statuses, titles, content', () => {
      /*
      ~check for instruction title, then content if specified
      ~check data tab title, then empty content if possible
      ~check for information tab title, content if needed
      */
    })

    it('play model, check for graph data instantiation', () => {

    })
  })

  context("Organism model", () => {
    it('loads mice into backback and begins organism model', () => {
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
    it('checks for four-up view', () => {
      fourUpView.getFourUpView()
        .should('be.visible')
      twoUpView.getTwoUpView()
        .should('be.visible')
        .and('have.length', 2)
    })
    it('adds mouse in organism model', () => {
      org.getOrganismView('top')
        .should('not.exist')
      backpack.getFullCollectButton().eq(0)
        .should('be.visible')
        .click({force:true})
      org.getEmptyButton('top')
        .should('be.visible')
        .click({force:true})
      org.getFullButton('top')
        .should('exist')
        .and('be.visible')
      org.getOrganismView('top')
        .should('exist')
    })
    it('clicks', () => {

    })

  })

})
