import { UIModel, UIModelType, createUIModel } from "./ui";
import { PopulationsModelType, createPopulationsModel } from "./spaces/populations/populations";
import { BackpackModel, BackpackModelType } from "./backpack";
import { flatten } from "flat";
import { OrganismsSpaceModel, OrganismsSpaceModelType } from "./spaces/organisms/organisms-space";

export type Curriculum = "mouse";

// allow for migration when needed
const STUDENT_DATA_VERSION = 1;

export interface IStores {
  ui: UIModelType;
  populations: PopulationsModelType;
  backpack: BackpackModelType;
  organisms: OrganismsSpaceModelType;
}

export function createStores(authoring: any): IStores {
  return {
    ui: createUIModel(authoring.ui),
    backpack: BackpackModel.create(authoring.backpack),
    populations: createPopulationsModel(authoring.curriculum, flatten(authoring.populations)),
    organisms: OrganismsSpaceModel.create(authoring.organism)
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
    }
  };
}
