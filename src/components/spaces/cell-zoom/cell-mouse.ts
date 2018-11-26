import { types, Instance } from "mobx-state-tree";
import { MouseColor } from "../../../models/mouse";
import { SubstanceType, OrganelleType, kOrganelleInfo } from "../../../models/spaces/cell-zoom/cell-zoom";

export const CellMouseModel = types
  .model("Populations", {
    baseColor: MouseColor
  })
  .views(self => ({
    getSubstanceValue(organelle: OrganelleType, substance: SubstanceType) {
      const substanceValues = kOrganelleInfo[organelle].substances[substance];
      return substanceValues ? substanceValues[self.baseColor] : 0;
    }
  }));

export type CellMouseModelType = Instance<typeof CellMouseModel>;
