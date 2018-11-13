import { UIModel, UIModelType } from "./ui";
import { PopulationsModelType, PopulationsModel } from "./spaces/populations/populations";

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
    populations: params && params.populations || PopulationsModel.create({})
  };
}
