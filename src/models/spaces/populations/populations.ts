import { types, Instance } from "mobx-state-tree";
import { MousePopulationsModel, MousePopulationsModelType } from "./mouse-model/mouse-populations-model";
import { Curriculum } from "../../stores";
import { Interactive, Events, Environment } from "populations.js";

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
