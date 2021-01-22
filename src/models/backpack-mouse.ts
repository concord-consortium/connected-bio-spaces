import { types } from "mobx-state-tree";
import uuid = require("uuid");

export const MouseColor = types.enumeration("type", ["brown", "white", "tan"]);
export type ColorType = typeof MouseColor.Type;

export const SexTypeEnum = types.enumeration("type", ["male", "female"]);
export type SexType = typeof SexTypeEnum.Type;

export const GenotypeEnum = types.enumeration("type", ["RR", "RC", "CR", "CC"]);
export type Genotype = typeof GenotypeEnum.Type;

export const UNCOLLECTED_IMAGE = "assets/mouse_collect.png";

export const BackpackMouse = types
  .model("Mouse", {
    id: types.optional(types.identifier, () => uuid()),
    sex: SexTypeEnum,
    genotype: GenotypeEnum,
    label: "",
    originMouseRefId: types.maybe(types.string),
  })
  .views(self => ({
    get baseColor(): ColorType {
      switch (self.genotype) {
        case "RR":
          return "brown";
        case "CC":
          return "white";
        default:
          return "tan";
      }
    },
    get baseImage(): string {
      switch (self.genotype) {
        case "RR":
          return "assets/mouse_field.png";
        case "CC":
          return "assets/mouse_beach.png";
        default:
          return "assets/mouse_tan.png";
      }
    },
    get nestImage(): string {
      switch (self.genotype) {
        case "RR":
          return "assets/mouse_field_nest.png";
        case "CC":
          return "assets/mouse_beach_nest.png";
        default:
          return "assets/mouse_tan_nest.png";
      }
    },
    get nestOutlineImage(): string {
      return "assets/unit/mouse/breeding/nesting/nest_mouse_outline.png";
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
      return (self.genotype === "RC" || self.genotype === "CR");
    },
  }))
  .actions(self => ({
    setLabel(val: string) {
      self.label = val;
    }
  }));

export type BackpackMouseType = typeof BackpackMouse.Type;
