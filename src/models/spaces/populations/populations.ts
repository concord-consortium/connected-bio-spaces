import { types, Instance } from "mobx-state-tree";
import { MousePopulationsModel, MousePopulationsModelType } from "./mouse-model/mouse-populations-model";
import { Curriculum } from "../../stores";

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
    model: ModelsUnion
  })
  .extend(self => {

    return {
      views: {
        get interactive() {
          return self.model.interactive;
        }
      },
      actions: {

      }
    };
  });

export type PopulationsModelType = Instance<typeof PopulationsModel>;
