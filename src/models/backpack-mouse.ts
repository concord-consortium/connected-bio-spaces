import { types } from "mobx-state-tree";
import uuid = require("uuid");
import { speciesDef, UnitTypeEnum } from "./units";

export const MouseColor = types.enumeration("type", ["brown", "white", "tan"]);
export type ColorType = typeof MouseColor.Type;

export const SexTypeEnum = types.enumeration("type", ["male", "female"]);
export type SexType = typeof SexTypeEnum.Type;

export const UNCOLLECTED_IMAGE = "assets/mouse_collect.png";

export const BackpackMouse = types
  .model("Mouse", {
    species: UnitTypeEnum,
    id: types.optional(types.identifier, () => uuid()),
    sex: SexTypeEnum,
    genotype: types.string,
    label: "",
    originMouseRefId: types.maybe(types.string),
  })
  .views(self => ({
    get phenotype(): string {
      return speciesDef(self.species).getPhenotype(self.genotype);
    },
    get baseImage(): string {
      return speciesDef(self.species).getBaseImage(self as BackpackMouseType);
    },
    get nestImage(): string {
      return speciesDef(self.species).getBreedingImage(self as BackpackMouseType);
    },
    get nestOutlineImage(): string {
      return speciesDef(self.species).getNestOutlineImage(self.genotype);
    },
    get zoomedInParentImage(): string {
      const species = speciesDef(self.species);
      if (species.getZoomedInParentImage) {
        return species.getZoomedInParentImage(self as BackpackMouseType);
      }
      return speciesDef(self.species).getBreedingImage(self as BackpackMouseType);
    },
    get chartImage(): string {
      const species = speciesDef(self.species);
      if (species.getChartImage) {
        return species.getChartImage(self as BackpackMouseType);
      }
      return species.getBaseImage(self as BackpackMouseType);
    },
    get chartEmptyImage(): string {
      return speciesDef(self.species).getChartEmptyImage(self as BackpackMouseType);
    },
    get zoomImage(): string {
      switch (self.genotype) {
        case "RR":
          return "assets/unit/mouse/zoom/mouse_field.gif";
        case "CC":
          return "assets/unit/mouse/zoom/mouse_beach.gif";
        default:
          return "assets/unit/mouse/zoom/mouse_tan.gif";
      }
    },
    get isHeterozygote(): boolean {
      // assumes two-letter genotype
      return self.genotype.charAt(0) !== self.genotype.charAt(1);
    },
  }))
  .views(self => ({
    get offspringImage(): string {
      const species = speciesDef(self.species);
      if (species.getOffspringImage) {
        return species.getOffspringImage(self as BackpackMouseType);
      }
      return self.nestImage;
    },
  }))
  .actions(self => ({
    setLabel(val: string) {
      self.label = val;
    }
  }));

export type BackpackMouseType = typeof BackpackMouse.Type;
