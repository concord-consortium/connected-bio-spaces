import { UIModelType, createUIModel, SpaceType } from "./ui";
import { PopulationsModelType, createPopulationsModel } from "./spaces/populations/populations";
import { BackpackModel, BackpackModelType } from "./backpack";
import { flatten } from "flat";
import { OrganismsSpaceModelType, createOrganismsModel } from "./spaces/organisms/organisms-space";
import { BackpackMouseType } from "./backpack-mouse";
import { ConnectedBioAuthoring, Unit } from "../authoring";
import { QueryParams } from "../utilities/url-params";
import { OrganismsMouseModelType } from "./spaces/organisms/mouse/organisms-mouse";
import { OrganismsRowModelType } from "./spaces/organisms/organisms-row";
import { autorun } from "mobx";
import { onAction } from "mobx-state-tree";
import { BreedingModelType, createBreedingModel, INestPair } from "./spaces/breeding/breeding";
import { EnvironmentColorType } from "../models/spaces/breeding/breeding";

// allow for migration when needed
const STUDENT_DATA_VERSION = 1;

export interface IStores {
  unit: Unit;
  ui: UIModelType;
  populations?: PopulationsModelType;
  backpack: BackpackModelType;
  organisms?: OrganismsSpaceModelType;
  breeding: BreedingModelType;
}

export type ConnectedBioModelCreationType = ConnectedBioAuthoring & QueryParams & UserSaveDataType;

export function createStores(initialModel: ConnectedBioModelCreationType): IStores {
  const ui = createUIModel(initialModel.ui);
  const backpack = BackpackModel.create(initialModel.backpack);
  const populations = createPopulationsModel(initialModel.unit, flatten(initialModel.populations));
  // since organisms and breeding may contain references to backpack mice, yet are in different trees,
  // we need to pass them in explicitly so they can be found
  const organisms = createOrganismsModel(initialModel.unit, initialModel.organisms, backpack);
  const breeding = createBreedingModel(initialModel.breeding);

  // inform organisms space if user selects a backpack mouse
  autorun(() => {
    if (organisms && ui.investigationPanelSpace === "organism" && backpack.activeMouse) {
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
  if (organisms) {
    onAction(organisms, call => {
      if (call.name === "clearRowBackpackMouse") {
        backpack.deselectMouse();
      }
    });
  }

  const stores: IStores = {
    unit: initialModel.unit,
    ui,
    backpack,
    breeding
  };

  if (populations) stores.populations = populations;
  if (organisms) stores.organisms = organisms;

  return stores;
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
  const snapshot: UserSaveDataType = {
    version: STUDENT_DATA_VERSION,
    ui: {
      investigationPanelSpace: stores.ui.investigationPanelSpace
    },
    backpack: {
      collectedMice: stores.backpack.collectedMice
    },
    breeding: {
      backgroundType: stores.breeding.backgroundType,
      nestPairs: stores.breeding.nestPairs
    }
  };

  if (stores.organisms) {
    const {organismsMice, rows} = stores.organisms;
    snapshot.organisms = {
      organismsMice,
      rows
    };
  }

  return snapshot;
}
