import { OrganismsSpaceModel, OrganismsSpaceModelType } from "./organisms-space";
import { destroy, detach } from "mobx-state-tree";

describe("Organisms Space model", () => {
  let organisms: OrganismsSpaceModelType;

  describe("without mystery labels", () => {
    beforeEach(() => {
      organisms = OrganismsSpaceModel.create({
        rows: []    // if we don't blank rows, we can't create this twice. Don't ask why...
      });
    });

    it("has default labels for substances", () => {
      expect(organisms.getSubstanceLabel("pheomelanin")).toEqual("pheomelanin");
    });

    it("has default labels for organelles", () => {
      expect(organisms.getOrganelleLabel("nucleus")).toEqual("Nucleus");
    });
  });

  describe("with mystery labels", () => {
    let organisms2: OrganismsSpaceModelType;
    beforeEach(() => {
      organisms2 = OrganismsSpaceModel.create({
        rows: [],
        useMysteryOrganelles: true,
        useMysterySubstances: true
      });
    });

    it("has default labels for substances", () => {
      expect(organisms2.getSubstanceLabel("pheomelanin")).toEqual("substance A");
    });

    it("has default labels for organelles", () => {
      expect(organisms2.getOrganelleLabel("nucleus")).toEqual("Location 2");
    });
  });
});
