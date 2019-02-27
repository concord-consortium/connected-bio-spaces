import { UIModelType, createUIModel, SpaceType } from "./ui";
import { PopulationsModelType, createPopulationsModel } from "./spaces/populations/populations";
import { BackpackModel, BackpackModelType } from "./backpack";
import { flatten } from "flat";
import { OrganismsSpaceModelType, createOrganismsModel } from "./spaces/organisms/organisms-space";
import { BackpackMouseType } from "./backpack-mouse";
import { ConnectedBioAuthoring } from "../authoring";
import { QueryParams } from "../utilities/url-params";
import { OrganismsMouseModelType } from "./spaces/organisms/organisms-mouse";
import { OrganismsRowModelType } from "./spaces/organisms/organisms-row";
import { autorun } from "mobx";

export type Curriculum = "mouse";

// allow for migration when needed
const STUDENT_DATA_VERSION = 1;

export interface IStores {
  ui: UIModelType;
  populations: PopulationsModelType;
  backpack: BackpackModelType;
  organisms: OrganismsSpaceModelType;
}

export type ConnectedBioModelCreationType = ConnectedBioAuthoring & QueryParams & UserSaveDataType;

export function createStores(initialModel: ConnectedBioModelCreationType): IStores {
  const ui = createUIModel(initialModel.ui);
  const backpack = BackpackModel.create(initialModel.backpack);
  const populations = createPopulationsModel(initialModel.curriculum, flatten(initialModel.populations));
  // since organisms may contain references to backpack mice, yet is in a different tree, we need to pass them in
  // explicitly so they can be found
  const organisms = createOrganismsModel(initialModel.organisms, backpack);

  // inform organisms space if user selects a backpack mouse
  autorun(() => {
    if (ui.investigationPanelSpace === "organism" && backpack.activeMouse) {
      const organismAdded = organisms.activeBackpackMouseUpdated(backpack.activeMouse);
      if (organismAdded) {
        backpack.deselectMouse();
      }
    }
  });

  return {
    ui,
    backpack,
    populations,
    organisms
  };
}

export interface UserSaveDataType {
  version?: number;
  ui?: {
    investigationPanelSpace: SpaceType;
  };
  backpack?: {
    collectedMice: BackpackMouseType[];
  };
  organisms?: {
    organismsMice: OrganismsMouseModelType[],
    rows: OrganismsRowModelType[]
  };
}

export function getUserSnapshot(stores: IStores): UserSaveDataType {
  const {organismsMice, rows} = stores.organisms;
  return {
    version: STUDENT_DATA_VERSION,
    ui: {
      investigationPanelSpace: stores.ui.investigationPanelSpace
    },
    backpack: {
      collectedMice: stores.backpack.collectedMice
    },
    organisms: {
      organismsMice,
      rows
    }
  };
}
