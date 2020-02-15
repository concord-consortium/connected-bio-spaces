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
import { onAction } from "mobx-state-tree";
import { BreedingModelType, createBreedingModel, INestPair } from "./spaces/breeding/breeding";
import { EnvironmentColorType } from "../models/spaces/breeding/breeding";

export type Curriculum = "mouse";

// allow for migration when needed
const STUDENT_DATA_VERSION = 1;

export interface IStores {
  ui: UIModelType;
  populations: PopulationsModelType;
  backpack: BackpackModelType;
  organisms: OrganismsSpaceModelType;
  breeding: BreedingModelType;
}

export type ConnectedBioModelCreationType = ConnectedBioAuthoring & QueryParams & UserSaveDataType;

export function createStores(initialModel: ConnectedBioModelCreationType): IStores {
  const ui = createUIModel(initialModel.ui);
  const backpack = BackpackModel.create(initialModel.backpack);
  const populations = createPopulationsModel(initialModel.curriculum, flatten(initialModel.populations));
  // since organisms and breeding may contain references to backpack mice, yet are in different trees,
  // we need to pass them in explicitly so they can be found
  const organisms = createOrganismsModel(initialModel.organisms, backpack);
  const breeding = createBreedingModel(initialModel.breeding);

  // inform organisms space if user selects a backpack mouse
  autorun(() => {
    if (ui.investigationPanelSpace === "organism" && backpack.activeMouse) {
      const organismAdded = organisms.activeBackpackMouseUpdated(backpack.activeMouse);
      if (organismAdded) {
        backpack.deselectMouse();
      }
    }
  });

  // Prevent user from having to deselect and reselect a selected backpack mouse in order to
  // add to a row.
  // deselect mice on space changes
  onAction(ui, call => {
    if (call.name === "setInvestigationPanelSpace") {
      backpack.deselectMouse();
    }
  });
  // and when organism rows are cleared
  onAction(organisms, call => {
    if (call.name === "clearRowBackpackMouse") {
      backpack.deselectMouse();
    }
  });

  return {
    ui,
    backpack,
    populations,
    organisms,
    breeding
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
  breeding?: {
    backgroundType: EnvironmentColorType,
    nestPairs: INestPair[]
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
    },
    breeding: {
      backgroundType: stores.breeding.backgroundType,
      nestPairs: stores.breeding.nestPairs
    }
  };
}
