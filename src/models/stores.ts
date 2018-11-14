import { UIModel, UIModelType } from "./ui";
import { PopulationsModelType, createPopulationsModel } from "./spaces/populations/populations";

export type Curriculum = "mouse";

const currentCurriculum = "mouse";

export interface IStores {
  ui: UIModelType;
  populations: PopulationsModelType;
}

export interface ICreateStores {
  ui?: UIModelType;
  populations?: PopulationsModelType;
}

export function createStores(params?: ICreateStores): IStores {
  return {
    ui: params && params.ui || UIModel.create({}),
    populations: params && params.populations || createPopulationsModel(currentCurriculum)
  };
}
