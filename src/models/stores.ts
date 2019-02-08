import { UIModel, UIModelType, createUIModel } from "./ui";
import { PopulationsModelType, createPopulationsModel } from "./spaces/populations/populations";
import { BackpackModel, BackpackModelType } from "./backpack";
import { flatten } from "flat";
import { OrganismsSpaceModel, OrganismsSpaceModelType } from "./spaces/organisms/organisms-space";
import { OrganismsMouseModel } from "./spaces/organisms/organisms-mouse";
import { OrganismsRowModel } from "./spaces/organisms/organisms-row";
import { BackpackMouse } from "./backpack-mouse";

export type Curriculum = "mouse";

const currentCurriculum = "mouse";

export interface IStores {
  ui: UIModelType;
  populations: PopulationsModelType;
  backpack: BackpackModelType;
  organisms: OrganismsSpaceModelType;
}

export interface ICreateStores {
  ui?: UIModelType;
  populations?: PopulationsModelType;
  backpack?: BackpackModelType;
  organisms?: OrganismsSpaceModelType;
}

export function createStores(params: ICreateStores, authoring: any): IStores {
  return {
    ui: params && params.ui || createUIModel(authoring.spaces),
    populations: params && params.populations ||
      createPopulationsModel(authoring.curriculum, flatten(authoring.populations)),
    backpack: params && params.backpack
      || BackpackModel.create({}),
    organisms: params && params.organisms ||
      OrganismsSpaceModel.create(authoring.organism)
  };
}
