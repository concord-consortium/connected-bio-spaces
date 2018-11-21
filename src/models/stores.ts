import { UIModel, UIModelType } from "./ui";
import { PopulationsModelType, createPopulationsModel } from "./spaces/populations/populations";
import { BackpackModel, BackpackModelType } from "./backpack";
import { flatten } from "flat";

export type Curriculum = "mouse";

const currentCurriculum = "mouse";

export interface IStores {
  ui: UIModelType;
  populations: PopulationsModelType;
  backpack: BackpackModelType;
}

export interface ICreateStores {
  ui?: UIModelType;
  populations?: PopulationsModelType;
  backpack?: BackpackModelType;
}

export function createStores(params: ICreateStores, authoring: any): IStores {
  return {
    ui: params && params.ui || UIModel.create({investigationPanelSpace: "none"}),
    populations: params && params.populations ||
      createPopulationsModel(authoring.curriculum, flatten(authoring.populations)),
    backpack: params && params.backpack || BackpackModel.create({})
  };
}
