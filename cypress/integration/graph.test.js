import Graph from '../support/elements/Graph'
import RightPanelContent from '../support/elements/RightPanelContent';
import Pop from '../support/elements/Pop';
import ExploreNav from '../support/elements/ExploreNav';

context('Tests Graph', () => {

    let graph = new Graph;
    let rightPanelContent = new RightPanelContent;
    let pop = new Pop;
    let exploreNav = new ExploreNav;

    before(function() {
        cy.visit('/')
        exploreNav.getExploreView('populations').click()
    })

    it('checks for right panel population title', () => {
        rightPanelContent.getDataTab().should('be.visible').click({force:true})
        rightPanelContent.getTitle().should('contain','Data').and('be.visible')
    })

    it('takes screenshot of empty   graph', () => {
        //empty graph screenshot
    })

    it('starts model with hawks added', () => {
        pop.getPopTool('addHawks').click()
        pop.getPopTool('run').should('exist').click()
        cy.wait(10000)
        pop.getPopTool('pause').click()
        rightPanelContent.getDataTab().click()
        graph.getGraph().should('exist').and('be.visible')
        graph.getGraphScrollbar().should('be.visible')
        graph.getPopShowData().should('exist').and('be.visible').and('contain', 'Show All Data').click()
        graph.getGraphScrollbar().should('not.be.visible')
        graph.getPopShowData().should('exist').and('be.visible').and('contain', 'Show Recent Data').click()
        graph.getGraphScrollbar().should('exist').and('be.visible')
    })

    it('click on legend', ()=>{
        graph.toggleWhiteMouseLegend();
        graph.toggleTanMouseLegend();
        graph.toggleBrownMouseLegend(); 
    })
})