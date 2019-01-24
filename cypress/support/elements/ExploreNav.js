class ExploreNav{

  getExploreView(view) {
    switch(view){
      case 'population' :
        return cy.get("div.icon.populations.clickable")
        break;
      case 'organism' :
        return cy.get("div.icon.organism.clickable")
        break;
      case 'breeding' :
        return cy.get("div.icon.breeding.clickable")
        break;
      case 'dna' :
        return cy.get("div.icon.dna.clickable")
        break;
    }
  }

  clickExploreView(view) {
    switch(view){
      case 'population' :
        getExploreView('population').click({force:true})
        break;
      case 'organism' :
        getExploreView('organism').click({force:true})
        break;
      case 'breeding' :
        getExploreView('breeding').click({force:true})
        break;
      case 'dna' :
        getExploreView('dna').click({force:true})
        break;
    }
  }
}
export default ExploreNav;
