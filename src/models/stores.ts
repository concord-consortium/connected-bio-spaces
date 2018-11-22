import { UIModel, UIModelType, createUIModel } from "./ui";
import { PopulationsModelType, createPopulationsModel } from "./spaces/populations/populations";
import { BackpackModel, BackpackModelType } from "./backpack";
import { flatten } from "flat";
import { CellZoomModel, CellZoomModelType } from "./spaces/cell-zoom/cell-zoom";
import { CellMouseModel } from "../components/spaces/cell-zoom/cell-mouse";
import { CellZoomRowModel } from "./spaces/cell-zoom/cell-zoom-row";

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

export function createStores(params: ICreateStores, authoring: any): IStores {
  return {
    ui: params && params.ui || createUIModel(authoring.spaces),
    populations: params && params.populations ||
      createPopulationsModel(authoring.curriculum, flatten(authoring.populations)),
    backpack: params && params.backpack || BackpackModel.create({}),
    cellZoom: params && params.cellZoom
      || CellZoomModel.create({
           organisms: {
            one: CellMouseModel.create({ id: "one", baseColor: "brown" }),
            two: CellMouseModel.create({ id: "two", baseColor: "white" })
          },
          rows: [
            CellZoomRowModel.create({organism: "one"}),
            CellZoomRowModel.create({organism: "two"}),
          ]
         })
  };
}
