import { types } from "mobx-state-tree";

export type ColorType = "brown" | "tan" | "white";

export const SexTypeEnum = types.enumeration("type", ["male", "female"]);
export type SexType = typeof SexTypeEnum.Type;

export const GenotypeEnum = types.enumeration("type", ["BB", "Bb", "bB", "bb"]);
export type Genotype = typeof GenotypeEnum.Type;

export const UNCOLLECTED_IMAGE = "assets/mouse_collect.png";

export const Mouse = types
  .model("Mouse", {
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
          return "assets/sandrat-tan.png";
      }
    },
    get isHeterozygote(): boolean {
      return (self.genotype === "Bb" || self.genotype === "bB");
    },
    setLabel(val: string) {
      self.label = val;
    }
  }));

export type MouseType = typeof Mouse.Type;
