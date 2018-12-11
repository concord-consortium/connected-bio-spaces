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
        interactionMode: "none"
      });
  }
}

export interface ToolbarButton {
  title: string;
  imageClass?: string;
  secondaryTitle?: string;
  secondaryTitleImageClass?: string;
  type?: string;
  value?: boolean;
  action: (e: (React.MouseEvent<HTMLButtonElement> | boolean)) => void;
  enabled?: boolean;
}

const InteractionModeEnum = types.enumeration("interaction", ["none", "select", "inspect"]);
export type InteractionModeType = typeof InteractionModeEnum.Type;

export const PopulationsModel = types
  .model("Populations", {
    model: ModelsUnion,
    isPlaying: false,
    instructions: "",
    interactionMode: InteractionModeEnum
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
          if (!self.isPlaying) {
            self.model.interactive.play();
            self.interactionMode = "none";
            // temporary
            self.model.interactive.exitInspectMode();
          } else {
            self.model.interactive.stop();
          }
        },
        play() {
          self.model.interactive.play();
          self.interactionMode = "none";
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
        toggleInteractionMode(mode: "select" | "inspect") {
          if (self.interactionMode === mode) {
            // unset mode, and return to playing if model was playing previously
            self.interactionMode = "none";
            if (modelWasPlaying) {
              self.play();
            }
          } else {
            // if we're switching from "none", save current play state. Then switch state
            if (self.interactionMode === "none") {
              modelWasPlaying = self.isPlaying;
              self.pause();
            }
            self.interactionMode = mode;
          }

          // set "info" mode on interactive. This is temporary, eventually we will show info in right
          // panel using the same mouse handler as the select view.
          if (self.interactionMode === "inspect") {
            self.model.interactive.enterInspectMode();
          } else {
            self.model.interactive.exitInspectMode();
          }
        }
      }
    };
  });

export type PopulationsModelType = Instance<typeof PopulationsModel>;
