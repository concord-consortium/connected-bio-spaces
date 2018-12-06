import { types, Instance, detach } from "mobx-state-tree";
import { MousePopulationsModel, MousePopulationsModelType } from "./mouse-model/mouse-populations-model";
import { Interactive, Events, Environment, Agent } from "populations.js";
import { ChartDataModelType } from "../charts/chart-data";
import { type } from "os";

const ModelsUnion = types.union(MousePopulationsModel);
type ModelsUnionType = MousePopulationsModelType;

export function createPopulationsModel(curriculumName: string, authoring: any): PopulationsModelType {
  switch (curriculumName) {
    case "mouse":
    default:
      return PopulationsModel.create({
        model: MousePopulationsModel.create(authoring),
        instructions: authoring.instructions,
        mouseMode: "none"
      });
  }
}

export interface ToolbarButton {
  title: string;
  type?: string;
  value?: boolean;
  action: (e: (React.MouseEvent<HTMLButtonElement> | boolean)) => void;
}

const InteractionModeEnum = types.enumeration("interaction", ["none", "select", "inspect"]);
export type InteractionModeType = typeof InteractionModeEnum.Type;

export const PopulationsModel = types
  .model("Populations", {
    model: ModelsUnion,
    isPlaying: false,
    instructions: "",
    mouseMode: InteractionModeEnum
  })
  .extend(self => {

    function updateIsPlaying() {
      if (self.isPlaying !== self.model.interactive.isPlaying) {
        self.isPlaying = self.model.interactive.isPlaying;
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
          if (self.mouseMode === "select" && self.isPlaying) {
            self.mouseMode = "none";
          }
        },
        play() {
          self.model.interactive.play();
          if (self.mouseMode === "select") self.mouseMode = "none";
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
  })
  .extend(self => {

    let modelWasPlaying = false;

    return {
      actions: {
        toggleSelectionMode() {
          if (self.mouseMode !== "select") {
            if (self.mouseMode === "inspect") self.model.interactive.exitInspectMode();
            self.mouseMode = "select";
            modelWasPlaying = self.isPlaying;
            self.pause();
          } else {
            self.mouseMode = "none";
            if (modelWasPlaying) {
              self.play();
            }
          }
        },
        toggleInspectMode() {
          if (self.mouseMode !== "inspect") {
            self.model.interactive.enterInspectMode();
            self.mouseMode = "inspect";
          } else {
            self.model.interactive.exitInspectMode();
            self.mouseMode = "none";
          }
        }
      }
    };
  });

export type PopulationsModelType = Instance<typeof PopulationsModel>;
