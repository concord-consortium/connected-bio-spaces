import { UIModel, UIModelType, createUIModel } from "./ui";
import { PopulationsModelType, createPopulationsModel } from "./spaces/populations/populations";
import { BackpackModel, BackpackModelType } from "./backpack";
import { flatten } from "flat";
import { OrganismsSpaceModel, OrganismsSpaceModelType, createOrganismsModel } from "./spaces/organisms/organisms-space";
import { resolveIdentifier } from "mobx-state-tree";
import { BackpackMouse } from "./backpack-mouse";

export type Curriculum = "mouse";

// allow for migration when needed
const STUDENT_DATA_VERSION = 1;

export interface IStores {
  ui: UIModelType;
  populations: PopulationsModelType;
  backpack: BackpackModelType;
  organisms: OrganismsSpaceModelType;
}

export function createStores(initialModel: any): IStores {
  const ui = createUIModel(initialModel.ui);
  const backpack = BackpackModel.create(initialModel.backpack);
  const populations = createPopulationsModel(initialModel.curriculum, flatten(initialModel.populations));
  // since organisms may contain references to backpack mice, yet is in a different tree, we need to pass them in
  // explicitly so they can be found
  const organisms = createOrganismsModel(initialModel.organisms, backpack);

  return {
    ui,
    backpack,
    populations,
    organisms
  };
}

export function getUserSnapshot(stores: IStores) {
  return {
    version: STUDENT_DATA_VERSION,
    ui: {
      investigationPanelSpace: stores.ui.investigationPanelSpace
    },
    backpack: {
      collectedMice: stores.backpack.collectedMice
    },
    organisms: stores.organisms
  };
}
