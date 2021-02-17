const visitMouseBreeding = () => {
  const authoring = {
    unit: "mouse",
    ui: {
      investigationPanelSpace: "breeding"
    }
  };
  const params = encodeURIComponent(JSON.stringify(authoring));
  cy.visit(`/?${params}`);
};

context("Test Mouse Breeding", () => {

  describe("Nesting space", () => {

    before(visitMouseBreeding);

    it("should show correct title", () => {
      cy.get(".header .title").should("be.visible")
        .and("contain", "Explore: Nesting Pairs");
    });

    it("the sex checkbox should be there", () => {
      cy.get("[data-test=breed-toolbar]")
        .find(".check-container").should("have.length", 3);
    });

    it("should use mouse nesting images", () => {
      cy.get("img.organism-image")
        .should("have.attr", "src").should("match", /mouse\/mouse_(tan|field)_nest.png/);
    });
  });

  describe("Data panel", () => {

    before(visitMouseBreeding);

    it("the sex graph button should be there", () => {
      cy.get(".footer.data>.button-holder").should("have.length", 3);
    });

    it("the default legend should  include 'Light Brown'", () => {
      cy.get(".legend-item").contains("Light Brown").should("be.visible");
    });

    it("the genotypes legend should include 'Mice'", () => {
      cy.get(".footer.data .button-holder").contains("Genotypes").click();
      cy.get(".legend-item").contains("Mice").should("be.visible");
    });

    it("should use outline images for the icons", () => {
      cy.get("img.left-mouse")
        .should("have.attr", "src").should("include", "assets/mouse_collect.png");
    });

    it("the pair labels should read 'Pair 1'", () => {
      cy.get(".nesting-pair-data-panel .title").contains("Pair 1").should("be.visible");
    });
  });

  describe("Breeding space", () => {

    before(() => {
      visitMouseBreeding();
      cy.get(".nest-pair.left-top.selectable").click();
    });

    it("should show correct title", () => {
      cy.get(".header .title").should("be.visible")
        .and("contain", "Explore: Nesting Pairs");
    });

    it("the parent label should be correct", () => {
      cy.get(".parents .parent-label").contains("Pair 1").should("exist");
    });

    it("should use nest images for the parents", () => {
      cy.get("img.organism-image")
        .should("have.attr", "src").should("match", /\/mouse\/mouse_(tan|field)_nest.png/);
    });

    it("should be able to breed offspring", () => {
      cy.get(".breeding-button.breed-button").click();
      cy.wait(50);
      cy.get(".litters .litter").should("have.length", 1);
    });

    it("should breed between 3 and 5 offspring each time", () => {
      cy.get(".breeding-button.breed-button").click();
      cy.wait(50);
      cy.get(".litters .litter").should("have.length", 2);
      cy.get(".litters .offspring-container").its("length").should("be.gte", 6);
      cy.get(".litters .offspring-container").its("length").should("be.lte", 10);
    });

    it("should use nest images for the offspring", () => {
      cy.get(".offspring img.organism-image")
        .should("have.attr", "src").should("include", "_nest.png");
    });

    it("should use base images for the inspected parents", () => {
      cy.get(".parent.left").click();
      cy.get(".inspect-panel img.organism-image")
        .should("have.attr", "src").should("match", /\/mouse\/mouse_(tan|field).png/);
    });
  });

  describe("Gametes", () => {

    before(() => {
      visitMouseBreeding();
      cy.get(".nest-pair.left-top.selectable").click();
      cy.get(".breeding-button.gametes .right").click();
      cy.get(".breeding-button.breed-button").click();
      cy.wait(50);
    });

    it("the inspect button should remain selected", () => {
      cy.get(".breeding-button.sticky[data-test=inspect-button]").should("exist");
    });

    it("should show the gametes", () => {
      cy.get(".gametes .gamete .egg").should("exist");
      cy.get(".gametes .gamete .sperm").should("exist");
    });

    it("should show the gametes for an inspected offspring", () => {
      cy.get(".litter .offspring-container").first().click();
      cy.get(".gamete-panel .gamete-panel-title")
        .should("contain", "Egg from mother");
    });
  });
});
