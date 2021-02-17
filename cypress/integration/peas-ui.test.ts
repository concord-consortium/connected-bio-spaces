const visitPeaBreeding = () => {
  const authoring = {
    unit: "pea",
    ui: {
      investigationPanelSpace: "breeding"
    }
  };
  const params = encodeURIComponent(JSON.stringify(authoring));
  cy.visit(`/?${params}`);
};

context("Test Peas Unit UI", () => {
  describe("Top Bar", () => {

    before(visitPeaBreeding);

    it("should show 'Peas'", () => {
      cy.get(".top-bar").should("be.visible")
        .and("contain", "Peas");
    });
  });

  describe("Nesting space", () => {

    before(visitPeaBreeding);

    it("should show correct title", () => {
      cy.get(".header .title").should("be.visible")
        .and("contain", "Explore: Greenhouse");
    });

    it("the sex checkbox should not be there", () => {
      cy.get("[data-test=breed-toolbar]")
        .find(".check-container").should("have.length", 2);
    });

    it("should use flowerpot images", () => {
      cy.get("img.organism-image")
        .should("have.attr", "src").should("include", "unit/pea/plant_1.png");
    });
  });

  describe("Data panel", () => {

    before(visitPeaBreeding);

    it("the sex graph button should not be there", () => {
      cy.get(".footer.data>.button-holder").should("have.length", 2);
    });

    it("the default legend should read 'Round' and 'Wrinkled'", () => {
      cy.get(".legend-item").contains("Round").should("be.visible");
      cy.get(".legend-item").contains("Wrinkled").should("be.visible");
    });

    it("the genotypes legend should include 'RR Peas'", () => {
      cy.get(".footer.data .button-holder").contains("Genotypes").click();
      cy.get(".legend-item").contains("RR Peas").should("be.visible");
    });

    it("should use flowerpot images for the icons", () => {
      cy.get("img.left-mouse")
        .should("have.attr", "src").should("include", "unit/pea/plant_1_outline.png");
    });

    it("the pair labels should read 'Exp. A'", () => {
      cy.get(".nesting-pair-data-panel .title").contains("Exp. A").should("be.visible");
    });
  });

  describe("Breeding space", () => {

    before(() => {
      visitPeaBreeding();
      cy.get(".nest-pair.left-top.selectable").click();
    });

    it("should show correct title", () => {
      cy.get(".header .title").should("be.visible")
        .and("contain", "Explore: Breeding");
    });

    it("the parent label should be correct", () => {
      cy.get(".parents .parent-label").contains("Exp. A").should("exist");
    });

    it("should use parent flower images for the parents", () => {
      cy.get("img.organism-image")
        .should("have.attr", "src").should("include", "unit/pea/flower_male.png");
    });

    it("should use pea images for the offspring", () => {
      cy.get(".breeding-button.breed-button").click();
      cy.wait(50);
      cy.get(".offspring img.organism-image")
        .should("have.attr", "src").should("include", "unit/pea/pea_");
    });

    it("should use parent zoom-in images for the inspected parents", () => {
      cy.get(".parent.left").click();
      cy.get(".inspect-panel img.organism-image")
        .should("have.attr", "src").should("include", "unit/pea/plant_1_male_zoom.png");

      cy.get(".parent.right").click();
      cy.get(".inspect-panel img.organism-image")
        .should("have.attr", "src").should("include", "unit/pea/plant_1_female_zoom.png");
    });

    it("should use pea images for the inspected peas", () => {
      cy.get(".litter .offspring-container").first().click();
      cy.get(".inspect-panel img.organism-image")
        .should("have.attr", "src").should("include", "unit/pea/pea_");
    });
  });

  describe("Gametes", () => {

    before(() => {
      visitPeaBreeding();
      cy.get(".nest-pair.left-top.selectable").click();
      cy.get(".breeding-button.gametes .right").click();
      cy.get(".breeding-button.breed-button").click();
      cy.wait(50);
    });

    it("should show the gametes for an inspected offspring", () => {
      cy.get(".litter .offspring-container").first().click();
      cy.get(".gamete-panel .gamete-panel-title")
        .should("contain", "Egg cell");
    });
  });
});
