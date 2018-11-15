import { types, Instance, detach } from "mobx-state-tree";
import { MousePopulationsModel, MousePopulationsModelType } from "./mouse-model/mouse-populations-model";
import { Curriculum } from "../../stores";
import { Interactive, Events, Environment } from "populations.js";
import { ChartDataModel, ChartDataModelType } from "../charts/chart-data";
import { ChartDataSetModel, ChartDataSetModelType, ChartColors, DataPoint } from "../charts/chart-data-set";

const ModelsUnion = types.union(MousePopulationsModel);
type ModelsUnionType = MousePopulationsModelType;

export function createPopulationsModel(curriculumName: Curriculum): PopulationsModelType {
  switch (curriculumName) {
    case "mouse":
    default:
      return PopulationsModel.create({
        model: MousePopulationsModel.create({})
      });
  }
}

export interface ToolbarButton {
  title: string;
  // tslint:disable-next-line:ban-types
  action: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const PopulationsModel = types
  .model("Populations", {
    model: ModelsUnion,
    isPlaying: false
  })
  .extend(self => {

    function updateIsPlaying() {
      self.isPlaying = self.model.interactive.isPlaying;
    }
    Events.addEventListener(Environment.EVENTS.START, updateIsPlaying);
    Events.addEventListener(Environment.EVENTS.STOP, updateIsPlaying);
    Events.addEventListener(Environment.EVENTS.RESET, updateIsPlaying);

    return {
      views: {
        get interactive(): Interactive {
          return self.model.interactive;
        },
        get toolbarButtons(): ToolbarButton[] {
          return self.model.toolbarButtons;
        },
        get currentData(): ChartDataModelType {
          return self.model.chartData;
        }
      },
      actions: {
        togglePlay() {
          self.model.interactive.togglePlay();
        },
        reset() {
          self.model.reset();
        }
      }
    };
  });

export type PopulationsModelType = Instance<typeof PopulationsModel>;
