class Graph {
    getLineChart() {
        return cy.get('data-test=line-chart')
    }
    getLineChartScroll() {
        return cy.get('#line-chart-controls')
    }
    getPopShowData(){
        return cy.get('[data-test=right-float-buttons] .float-button.upper-right');
    }
    togglePopShowData(){
        cy.get('[data-test=right-float-buttons] .float-button.upper-right').click();
    }
    getFooterButton(){
        return cy.get('.footer .button-holder')
    }
    getGraphCanvas(){
        return cy.get('[data-test=line-chart] canvas')
    }
    toggleWhiteMouseLegend(){
        this.getGraphCanvas().click(100, 526, {force:true})
    }
    toggleTanMouseLegend(){
        this.getGraphCanvas().click(200, 526, {force:true})
    }
    toggleBrownMouseLegend(){
        this.getGraphCanvas().click(300, 526, {force:true})
    }
}

export default Graph;