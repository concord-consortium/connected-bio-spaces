import { UIModel, UIModelType } from "./ui";
import { PopulationsModelType, createPopulationsModel } from "./spaces/populations/populations";
import { BackpackModel, BackpackModelType } from "./backpack";
import { CellZoomModel, CellZoomModelType } from "./spaces/cell-zoom/cell-zoom";

export type Curriculum = "mouse";

const currentCurriculum = "mouse";

export interface IStores {
  ui: UIModelType;
  populations: PopulationsModelType;
  backpack: BackpackModelType;
  cellZoom: CellZoomModelType;
}

export interface ICreateStores {
  ui?: UIModelType;
  populations?: PopulationsModelType;
  backpack?: BackpackModelType;
  cellZoom?: CellZoomModelType;
}

export function createStores(params?: ICreateStores): IStores {
  return {
    ui: params && params.ui || UIModel.create({}),
    populations: params && params.populations || createPopulationsModel(currentCurriculum),
    backpack: params && params.backpack || BackpackModel.create({}),
    cellZoom: params && params.cellZoom || CellZoomModel.create({})
  };
}
