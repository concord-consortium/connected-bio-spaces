import { types, Instance } from "mobx-state-tree";
import { MouseColor, BackpackMouse } from "../../backpack-mouse";
import { SubstanceType, kOrganelleInfo } from "./organisms-space";
import { v4 as uuid } from "uuid";
import { OrganelleType } from "./organisms-row";

export const OrganismsMouseModel = types
  .model("OrganismsMouse", {
    id: types.optional(types.identifier, () => uuid()),
    backpackMouse: types.reference(BackpackMouse)
  })
  .views(self => {
    function getSubstanceValue(organelle: OrganelleType, substance: SubstanceType) {
      const substanceValues = kOrganelleInfo[organelle].substances[substance];
      return substanceValues ? substanceValues[self.backpackMouse.baseColor] : 0;
    }

    function getPercentDarkness() {
      const eumelaninLevel = getSubstanceValue("melanosome", "eumelanin");
      return Math.max(0, Math.min(1, eumelaninLevel / 500)) * 100;
    }

    return {
      getSubstanceValue,
      getPercentDarkness,
      get modelProperties() {
        const darkness = self.backpackMouse.baseColor === "white"
          ? 0
          : self.backpackMouse.baseColor === "tan"
            ? 1
            : 2;
        return {
          albino: false,
          working_tyr1: false,
          working_myosin_5a: true,
          open_gates: false,
          eumelanin: getPercentDarkness(),
          hormone_spawn_period: 40,
          base_darkness: darkness
        };
      }
    };
  });

export type OrganismsMouseModelType = Instance<typeof OrganismsMouseModel>;
