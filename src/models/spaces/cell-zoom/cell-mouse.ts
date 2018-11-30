import { types, Instance } from "mobx-state-tree";
import { MouseColor, BackpackMouse } from "../../backpack-mouse";
import { SubstanceType, kOrganelleInfo } from "./cell-zoom";
import { v4 as uuid } from "uuid";
import { OrganelleType } from "./cell-zoom-row";

export const CellMouseModel = types
  .model("CellMouse", {
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
        const workingReceptor = self.backpackMouse.baseColor !== "white";
        return {
          albino: false,
          working_tyr1: false,
          working_myosin_5a: true,
          open_gates: false,
          eumelanin: getPercentDarkness(),
          hormone_spawn_period: 40,
          working_receptor: workingReceptor
        };
      }
    };
  });

export type CellMouseModelType = Instance<typeof CellMouseModel>;
