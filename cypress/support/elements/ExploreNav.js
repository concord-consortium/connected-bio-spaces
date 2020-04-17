class ExploreNav {

  getExploreView(view) {
    if (view == 'heredity') {
      return cy.get("div.icon.breeding.clickable")
    } else {
      return cy.get("div.icon." + view + ".clickable")
    }
  }

  clickExploreView(view) {
    switch (view) {
      case 'population':
        this.getExploreView('population').click({ force: true })
        break;
      case 'organism':
        this.getExploreView('organism').click({ force: true })
        break;
      case 'heredity':
        this.getExploreView('heredity').click({ force: true })
        break;
      case 'dna':
        this.getExploreView('dna').click({ force: true })
        break;
    }
  }
}
export default ExploreNav;
