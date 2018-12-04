
context("Test the population level", () => {
  describe("Two Up View", () => {
    it("verifies two up view is visible", () => {
      cy.visit("")
      cy.get("div.icon.populations.clickable").click();
      cy.wait(1000);
      cy.wait
      cy.get("[data-test=two-up-display]").should("be.visible");
      cy.get("[data-test=left-title]").should("be.visible");
      cy.get("[data-test=right-title]").should("be.visible");
    });

    it('exits two up view/population model and returns', () => {
      cy.get('div.icon.organism.clickable').click()
      cy.get('[data-test=four-up-display]').should('be.visible')
      cy.wait(2000)
      cy.get('div.icon.populations.clickable').click()
      cy.get('[data-test=two-up-display]').should('be.visible')
    });

  });

  describe("Tools", () => {

    it("adds mice and runs model", () => {
      cy.get('[data-test=pop-toolbar]').find('button').eq(2).click({force:true}); //add mice
      cy.get('[data-test=pop-toolbar]').find('button').eq(0).click({force:true}); //run
      cy.wait(2000)
    });

    it('resets model then runs with mice and hawks', () => {
      cy.get('[data-test=pop-toolbar]').find('button').eq(1).click({force:true}); //reset
      cy.get('[data-test=pop-toolbar]').find('button').eq(2).click({force:true}); //add mice
      cy.get('[data-test=pop-toolbar]').find('button').eq(3).click({force:true}); //add hawks
      cy.wait(2000)
      cy.get('[data-test=pop-toolbar]').find('button').eq(0).click({force:true}); //run
    });

    it('runs model after pausing and changing environment', () => {
      cy.get('[data-test=pop-toolbar]').find('button').eq(0).click({force:true}); //run
      cy.get('[data-test=pop-toolbar]').find('button').eq(4).click({force:true}); //change env
      cy.wait(2000)
      cy.get('[data-test=pop-toolbar]').find('button').eq(4).click({force:true}); //change env
      cy.get('[data-test=pop-toolbar]').find('button').eq(2).click({force:true}); //add mice
      cy.get('[data-test=pop-toolbar]').find('button').eq(1).click({force:true}); //reset
      cy.get('[data-test=pop-toolbar]').find('button').eq(2).click({force:true}); //add mice
      cy.get('[data-test=pop-toolbar]').find('button').eq(3).click({force:true}); //add hawk
      cy.get('[data-test=pop-toolbar]').find('button').eq(0).click({force:true}); //run
    });

    it("verifies select button functionality", () => {
      cy.get('[data-test=pop-toolbar]').find('button').eq(0).click({force:true});
      cy.get('[data-test=pop-toolbar]').contains('Run');
      cy.get('[data-test=select-button]').click({force:true});
      //Need to be able to read iframe data in order to locate mouse coordinates
    });

  });

  describe("Backpack", () => {

    it("is visible by default", () => {
      cy.visit("/")
      cy.get('div.button-holder.collect').find('img').should('have.length', 6);
      cy.get('div.button-holder.collect').find('img').eq(0).should('have.class', 'icon')
    });

it("removes a mouse from the backpack", () => {

    });

    it("attempts to add more than 6 mice to backpack", () => {

    });




  });

  describe("Graph", () => {
    it("is visible by default", () => {

    });

    it("verifies the legend shows correctly", () => {

    });

  });

});
