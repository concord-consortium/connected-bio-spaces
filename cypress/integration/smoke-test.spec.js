import Backpack from '../support/elements/Backpack'
import ExploreNav from '../support/elements/ExploreNav'
import Pop from '../support/elements/Pop'
import Org from '../support/elements/Org'
import TwoUpView from '../support/elements/TwoUpView'
import FourUpView from '../support/elements/FourUpView'
import RightPanelContentFourUp from '../support/elements/RightPanelContentFourUp'
import RightPanelContent from '../support/elements/RightPanelContent'


context("Connected Bio Smoke Test", () => {

  let backpack = new Backpack;
  let exploreNav = new ExploreNav;
  let pop = new Pop;
  let org = new Org;
  let twoUpView = new TwoUpView;
  let fourUpView = new FourUpView;
  let rightPanelContentFourUp = new RightPanelContentFourUp;
  let rightPanelContent = new RightPanelContent;

  let mouse = [{
    sex: "female",
    genotype: "RR"
  }]

  before(function () {
    cy.visit('/?{"backpack":{"collectedMice":[{"sex":"' + mouse[0].sex + '","genotype":"' + mouse[0].genotype + '"}]}}')
  })

  context("Default Display", () => {
    it('verifies load', () => {
      cy.get('.main-content.none').should('be.visible')
    })
  })

  context("Left Nav", () => {
    it('verifies different explore options are visible', () => {
      exploreNav.getExploreView('populations').should('be.visible');
      exploreNav.getExploreView('breeding').should('be.visible').should('be.visible').should('be.visible')
    })
    it('verifies all 6 empty mouse collectors', () => {
      backpack.getEmptyCollectButton().should('be.visible').and('have.length', 6 - mouse.length)
      backpack.getFullCollectButton().should('be.visible').and('have.length', mouse.length)
    })
    it('verifies legend components are visible', () => {
      backpack.getLegendComponents().should('be.visible').and('have.length', 3)
    })
  })

  context("Population model", () => {
    it('checks for two-up view', () => {
      exploreNav.getExploreView('populations').should('be.visible').click({ force: true })
      twoUpView.getTwoUpView().should('be.visible').and('have.length', 1)
    })

    it('checks for left and right headers', () => {
      twoUpView.getLeftTitle().should('contain', 'Explore: Population')
      twoUpView.getRightTitle().should('contain', 'Instructions')
    })

    it('runs, resets, and adds hawks to model', () => {
      pop.getPopTool('addHawks').should('be.visible').click({ force: true });
      pop.getPopTool('run').should('be.visible').click({ force: true });
      pop.getPopTool('reset').should('be.visible').click({ force: true });
    })

    it('changes environment and runs again', () => {
      pop.getPopTool('changeEnv').should('be.visible').click({ foce: true })
      pop.getPopTool('addHawks').should('be.visible').click({ force: true });
      pop.getPopTool('run').should('be.visible').click({ force: true });
      pop.getPopTool('reset').should('be.visible').click({ force: true });
    })

    it('changes environment last time and runs again', () => {
      pop.getPopTool('changeEnv').should('be.visible').click({ foce: true })
      pop.getPopTool('addHawks').should('be.visible').click({ force: true });
      pop.getPopTool('run').should('be.visible').click({ force: true });
      cy.wait(2000)
    })

    it('collects mice, checks backpack for update', () => {
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
      pop.getPopTool('reset').click({ force: true }, { force: true })
      backpack.getFullCollectButton().should('be.visible')
    })

    it('toggles sex and heterozygote checkboxes', () => {

    })
  })

  context("Population and Graph", () => {
    it('check default tab statuses, titles, content', () => {
      rightPanelContent.getTitle().contains('Instructions').should('be.visible')
      rightPanelContent.getDataTab().should('be.visible').click({ force: true })
      rightPanelContent.getTitle().contains('Data')
      rightPanelContent.getDataContent().should('exist')
      rightPanelContent.getInformationTabDisabled().should('exist')
    })

  })

  context("Organism model", () => {

    it('loads mice into backback and begins organism model', () => {
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
    it("checks right panel default for tabs, titles, content", () => {
      rightPanelContentFourUp.getFourUp('top').within(() => {
        rightPanelContentFourUp.getTitle().contains('Instructions')
        rightPanelContentFourUp.getRightHeaderTabs().eq(1).should('be.visible').click({ force: true })
        rightPanelContentFourUp.getTitle().contains('Data')
        rightPanelContentFourUp.getRightHeaderTabs().eq(2).should('be.visible').click({ force: true })
        rightPanelContentFourUp.getTitle().contains('Information')
        rightPanelContentFourUp.getContent().contains("You'll need to zoom in deeper to find something to inspect")
      })
    })
    it('checks for four-up view', () => {
      fourUpView.getFourUpDisplay().should('be.visible')
      twoUpView.getTwoUpView().should('be.visible').and('have.length', 2)
    })
    it('checks for default disabled tools', () => {
      fourUpView.getFourUp('top').within( () => {
      org.getOrgTool('measure').should('have.class', 'disabled')
      org.getOrgTool('add-substance').should('have.class', 'disabled')
      org.getOrgTool('inspect').should('have.class', 'disabled')
      })
    })
    it('adds mouse in organism model', () => {
      fourUpView.getFourUpDisplay().within(() => {
        org.getEmptyButton().should('have.length', 2)
      })
      backpack.getFullCollectButton().eq(0).click()
      fourUpView.getFourUpDisplay().within(() => {
        org.getEmptyButton().should('have.length', 1)
        org.getFullButton().should('have.length', 1)
      })
    })

    it('zooms into the cell view and assert enabled buttons', () => {
      fourUpView.getFourUp('top').within(() => {
        org.getOrgTool('zoom-in').should('be.visible').click({ force: true })
        cy.wait(10000)
        org.getOrgTool('zoom-out').should('not.have.class', 'disabled')
        org.getOrgTool('measure').should('not.have.class', 'disabled')
        org.getOrgTool('add-substance').should('not.have.class', 'disabled')
        org.getOrgTool('inspect').should('have.class', 'disabled')
      })
    })

    it('zooms into the protein view', () => {
      fourUpView.getFourUp('top').within(() => {
        org.getOrgTool('zoom-in').click({ force: true })
        org.triggerTargetZoom1()

      })

    })
    it.skip('zooms out to cell view', () => {
      fourUpView.getFourUp('top').within(() => {
        org.getOrgTool('zoom-out').should('be.visible').click({ force: true })
        cy.wait(5000)
      })
    })
  })

})
