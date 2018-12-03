import { types, Instance } from "mobx-state-tree";
import { createInteractive, HawksMiceInteractive } from "./hawks-mice-interactive";
import { Interactive, Events, Environment } from "populations.js";
import { ToolbarButton } from "../populations";
import { ChartDataModel } from "../../charts/chart-data";

const chartData = {
  name: "Samples",
  dataSets: [
    {
      name: "White mice",
      dataPoints: [],
      color: "#f4ce83",
      maxPoints: 100,
      fixedMin: 0,
      fixedMax: 100,
      expandOnly: true,
      fixedLabelRotation: 0
    },
    {
      name: "Tan mice",
      dataPoints: [],
      color: "#db9e26",
      maxPoints: 100,
      fixedMin: 0,
      fixedMax: 100,
      expandOnly: true,
      fixedLabelRotation: 0
    },
    {
      name: "Brown mice",
      dataPoints: [],
      color: "#795423",
      maxPoints: 100,
      fixedMin: 0,
      fixedMax: 100,
      expandOnly: true,
      fixedLabelRotation: 0
    }
  ]
 };

const EnvironmentColorTypeEnum = types.enumeration("environment", ["white", "neutral", "brown"]);
export type EnvironmentColorType = typeof EnvironmentColorTypeEnum.Type;

export const MousePopulationsModel = types
  .model("MousePopulations", {
    "environment": EnvironmentColorTypeEnum,
    "numHawks": types.number,
    "initialPopulation.white": types.number,
    "initialPopulation.tan": types.number,
    "showSwitchEnvironmentsButton": types.boolean,
    "includeNeutralEnvironment": types.boolean,
    "inheritance.showStudentControlOfMutations": types.boolean,
    "inheritance.breedWithMutations": types.boolean,
    "inheritance.chanceOfMutations": types.number,
    "inheritance.showStudentControlOfInheritance": types.boolean,
    "inheritance.breedWithoutInheritance": types.boolean,
    "inheritance.randomOffspring.white": types.number,
    "inheritance.randomOffspring.tan": types.number,
    "showSexStack": false,
    "chartData": types.optional(ChartDataModel, chartData)
  })
  .extend(self => {
    let interactive: HawksMiceInteractive;

    function addData(time: number, datum: any) {
      self.chartData.dataSets[0].addDataPoint(time, datum.numWhite, "");
      self.chartData.dataSets[1].addDataPoint(time, datum.numTan, "");
      self.chartData.dataSets[2].addDataPoint(time, datum.numBrown, "");
    }
    Events.addEventListener(Environment.EVENTS.STEP, () => {
      const date = interactive.environment.date;
      if (date % 5 === 0) {
        addData(date / 5, interactive.getData());
      }
    });

    return {
      views: {
        get interactive(): HawksMiceInteractive {
          if (interactive) {
            return interactive;
          } else {
            interactive = createInteractive(self as MousePopulationsModelType);
            return interactive;
          }
        },

        get chanceOfMutation() {
          if (!self["inheritance.breedWithMutations"]) {
            return 0;
          }
          return self["inheritance.chanceOfMutations"] / 100;
        }
      },
      actions: {
        setEnvironmentColor(color: EnvironmentColorType) {
          self.environment = color;
        },
        setBreedWithMutations(value: boolean) {
          self["inheritance.breedWithMutations"] = value;
        },
        setBreedWithoutInheritance(value: boolean) {
          self["inheritance.breedWithoutInheritance"] = value;
        },
        reset() {
          interactive.reset();
          self.chartData.dataSets[0].clearDataPoints();
          self.chartData.dataSets[1].clearDataPoints();
          self.chartData.dataSets[2].clearDataPoints();
        }
      }
    };
  })
  .extend(self => {
    return {
      views: {
        get toolbarButtons(): ToolbarButton[] {
          const buttons = [];

          buttons.push({
            title: "Add Mice",
            action: (e: any) => {
              const {"initialPopulation.white": white, "initialPopulation.tan": tan} = self;
              self.interactive.addInitialMicePopulation(30, {white, tan});
            }
          });

          buttons.push({
            title: "Add Hawks",
            action: (e: any) => {
              self.interactive.addInitialHawksPopulation(self.numHawks);
            }
          });

          if (self.showSwitchEnvironmentsButton) {
            buttons.push({
              title: "Switch environments",
              action: (e: any) => {
                self.interactive.switchEnvironments(self.includeNeutralEnvironment);
              }
            });
          }

          if (self["inheritance.showStudentControlOfMutations"]) {
            buttons.push({
              title: "Breed with muations",
              type: "checkbox",
              value: self["inheritance.breedWithMutations"],
              action: (val: boolean) => {
                self.setBreedWithMutations(val);
              }
            });
          }

          if (self["inheritance.showStudentControlOfInheritance"]) {
            buttons.push({
              title: "Breed without inheritance",
              type: "checkbox",
              value: self["inheritance.breedWithoutInheritance"],
              action: (val: boolean) => {
                self.setBreedWithoutInheritance(val);
              }
            });
          }

          return buttons;
        }
      }
    };
  });

export type MousePopulationsModelType = Instance<typeof MousePopulationsModel>;
