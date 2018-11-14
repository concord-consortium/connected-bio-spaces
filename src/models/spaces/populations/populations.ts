import { types, Instance } from "mobx-state-tree";
import { MousePopulationsModel, MousePopulationsModelType } from "./mouse-model/mouse-populations-model";
import { Curriculum } from "../../stores";
import { Interactive, Events, Environment } from "populations.js";
import { ChartDataModel, ChartDataModelType } from "../charts/chart-data";
import { ChartDataSetModel, ChartColors, DataPoint } from "../charts/chart-data-set";

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
          // Grab current data points and prepare for display in a chart
          // TODO: replace with real data
          const points = [];
          points.push (DataPoint.create({ a1: 10, a2: 5, label: "alpha" }));
          points.push (DataPoint.create({ a1: 20, a2: 15, label: "bravo" }));
          points.push (DataPoint.create({ a1: 30, a2: 17, label: "charlie" }));
          points.push (DataPoint.create({ a1: 40, a2: 20, label: "delta" }));
          points.push (DataPoint.create({ a1: 50, a2: 19, label: "echo" }));
          points.push (DataPoint.create({ a1: 60, a2: 16, label: "foxtrot" }));
          points.push (DataPoint.create({ a1: 70, a2: 14, label: "golf" }));

          const chartDataSets = [];
          chartDataSets.push(ChartDataSetModel.create({
            name: "Sample Dataset",
            dataPoints: points,
            color: ChartColors[0].hex
          }));
          const chartData: ChartDataModelType = ChartDataModel.create({
            name: "Samples",
            dataSets: chartDataSets
          });
          return chartData;
        }
      },
      actions: {
        togglePlay() {
          self.model.interactive.togglePlay();
        },
        reset() {
          self.model.interactive.reset();
        }
      }
    };
  });

export type PopulationsModelType = Instance<typeof PopulationsModel>;
