import { types, Instance, detach } from "mobx-state-tree";
import { MousePopulationsModel, MousePopulationsModelType } from "./mouse-model/mouse-populations-model";
import { Interactive, Events, Environment, Agent } from "populations.js";
import { ChartDataModelType } from "../charts/chart-data";

const ModelsUnion = types.union(MousePopulationsModel);
type ModelsUnionType = MousePopulationsModelType;

export function createPopulationsModel(curriculumName: string, authoring: any): PopulationsModelType {
  switch (curriculumName) {
    case "mouse":
    default:
      return PopulationsModel.create({
        model: MousePopulationsModel.create(authoring),
        instructions: authoring.instructions
      });
  }
}

export interface ToolbarButton {
  title: string;
  type?: string;
  value?: boolean;
  action: (e: (React.MouseEvent<HTMLButtonElement> | boolean)) => void;
}

export const PopulationsModel = types
  .model("Populations", {
    model: ModelsUnion,
    isPlaying: false,
    instructions: ""
  })
  .extend(self => {

    function updateIsPlaying() {
      if (self.isPlaying !== self.model.interactive.isPlaying) {
        self.isPlaying = self.model.interactive.isPlaying;

        if (self.isPlaying) {
          // clear any subset information and return to viewing the live tail
          const d: ChartDataModelType = self.model.chartData;
          d.setDataSetSubset(-1, d.maxPoints);
        }
      }
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
        play() {
          self.model.interactive.play();
        },
        pause() {
          self.model.interactive.stop();
        },
        reset() {
          self.model.reset();
        },
        removeAgent(agent: Agent) {
          self.model.interactive.removeAgent(agent);
        }
      }
    };
  });

export type PopulationsModelType = Instance<typeof PopulationsModel>;
