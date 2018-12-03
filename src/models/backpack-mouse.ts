import { types } from "mobx-state-tree";
import uuid = require("uuid");

export const MouseColor = types.enumeration("type", ["brown", "white", "tan"]);
export type ColorType = typeof MouseColor.Type;

export const SexTypeEnum = types.enumeration("type", ["male", "female"]);
export type SexType = typeof SexTypeEnum.Type;

export const GenotypeEnum = types.enumeration("type", ["BB", "Bb", "bB", "bb"]);
export type Genotype = typeof GenotypeEnum.Type;

export const UNCOLLECTED_IMAGE = "assets/mouse_collect.png";

export const BackpackMouse = types
  .model("Mouse", {
    id: types.optional(types.identifier, () => uuid()),
    sex: SexTypeEnum,
    genotype: GenotypeEnum,
    label: ""
  })
  .views(self => ({
    get baseColor(): ColorType {
      switch (self.genotype) {
        case "BB":
          return "brown";
        case "bb":
          return "white";
        default:
          return "tan";
      }
    },
    get baseImage(): string {
      switch (self.genotype) {
        case "BB":
          return "assets/mouse_field.png";
        case "bb":
          return "assets/mouse_beach.png";
        default:
          return "assets/mouse_tan.png";
      }
    },
    get isHeterozygote(): boolean {
      return (self.genotype === "Bb" || self.genotype === "bB");
    },
    setLabel(val: string) {
      self.label = val;
    }
  }));

export type BackpackMouseType = typeof BackpackMouse.Type;
