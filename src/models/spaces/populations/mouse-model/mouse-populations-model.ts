import { types, Instance } from "mobx-state-tree";
import { createInteractive, EnvironmentColor, HawksMiceInteractive } from "./hawks-mice-interactive";
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
      expandOnly: true
    },
    {
      name: "Tan mice",
      dataPoints: [],
      color: "#db9e26",
      maxPoints: 100
    },
    {
      name: "Brown mice",
      dataPoints: [],
      color: "#795423",
      maxPoints: 100,
      fixedMin: 0,
      expandOnly: true
    }
  ]
 };

export const MousePopulationsModel = types
  .model("MousePopulations", {
    "initialEnvironment": types.string,
    "numHawks": types.number,
    "initialPopulation.white": types.number,
    "initialPopulation.tan": types.number,
    "showSwitchEnvironmentsButton": types.boolean,
    "includeNeutralEnvironment": types.boolean,
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
        get interactive(): Interactive {
          if (interactive) {
            return interactive;
          } else {
            interactive = createInteractive(self as MousePopulationsModelType);
            return interactive;
          }
        },

        get toolbarButtons(): ToolbarButton[] {
          const buttons = [];

          buttons.push({
            title: "Add Mice",
            action: (e: any) => {
              const {"initialPopulation.white": white, "initialPopulation.tan": tan} = self;
              interactive.addInitialMicePopulation(30, {white, tan});
            }
          });

          buttons.push({
            title: "Add Hawks",
            action: (e: any) => {
              interactive.addInitialHawksPopulation(self.numHawks);
            }
          });

          if (self.showSwitchEnvironmentsButton) {
            buttons.push({
              title: "Switch environments",
              action: (e: any) => {
                interactive.switchEnvironments(self.includeNeutralEnvironment);
              }
            });
          }

          return buttons;
        },

        get environmentColor(): EnvironmentColor {
          switch (self.initialEnvironment) {
            case "white":
            case "brown":
            case "neutral":
              return self.initialEnvironment;
            default:
              return "white";
          }
        }
      },
      actions: {
        setEnvironmentColor(color: EnvironmentColor) {
          self.initialEnvironment = color;
        },
        reset() {
          interactive.reset();
          self.chartData.dataSets[0].clearDataPoints();
          self.chartData.dataSets[1].clearDataPoints();
          self.chartData.dataSets[2].clearDataPoints();
        }
      }
    };
  });

export type MousePopulationsModelType = Instance<typeof MousePopulationsModel>;
