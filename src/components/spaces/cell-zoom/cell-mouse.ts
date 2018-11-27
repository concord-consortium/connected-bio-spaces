import { types, Instance } from "mobx-state-tree";
import { MouseColor } from "../../../models/mouse";
import { SubstanceType, kOrganelleInfo } from "../../../models/spaces/cell-zoom/cell-zoom";
import { v4 as uuid } from "uuid";
import { OrganelleType } from "../../../models/spaces/cell-zoom/cell-zoom-row";

export const CellMouseModel = types
  .model("CellMouse", {
    id: types.optional(types.identifier, () => uuid()),
    baseColor: MouseColor
  })
  .views(self => ({
    getSubstanceValue(organelle: OrganelleType, substance: SubstanceType) {
      const substanceValues = kOrganelleInfo[organelle].substances[substance];
      return substanceValues ? substanceValues[self.baseColor] : 0;
    }
  }));

export type CellMouseModelType = Instance<typeof CellMouseModel>;
