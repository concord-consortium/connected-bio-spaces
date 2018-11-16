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
      maxPoints: 100
    },
    {
      name: "Brown mice",
      dataPoints: [],
      color: "#795423",
      maxPoints: 100
    }
  ]
 };

export const MousePopulationsModel = types
  .model("MousePopulations", {
    environment: "white" as EnvironmentColor,
    numHawks: 2,
    addMiceByColor: true,
    percentWhite: 0.5,
    percentbb: 0.33,
    percentBb: 0.33,
    showHeteroStack: false,
    showSexStack: false,
    chartData: types.optional(ChartDataModel, chartData)
  })
  .extend(self => {
    let interactive: HawksMiceInteractive;
    function addData(datum: any) {
      const date = interactive.environment.date;
      self.chartData.dataSets[0].addDataPoint(date, datum.numWhite, "");
      self.chartData.dataSets[1].addDataPoint(date, datum.numBrown, "");
    }
    Events.addEventListener(Environment.EVENTS.STEP, () => {
      addData(interactive.getData());
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
              if (self.addMiceByColor) {
                const white = self.percentWhite;
                const brown = 1 - white;
                interactive.addInitialMicePopulation(20, true, {white, brown});
              } else {
                const bb = self.percentbb;
                const Bb = self.percentBb;
                const BB = 1 - bb - Bb;
                interactive.addInitialMicePopulation(20, false, {bb, Bb, BB});
              }
            }
          });

          buttons.push({
            title: "Add Hawks",
            action: (e: any) => {
              interactive.addInitialHawksPopulation(self.numHawks);
            }
          });

          return buttons;
        },

        get environmentColor(): EnvironmentColor {
          switch (self.environment) {
            case "white":
            case "brown":
            case "neutral":
              return self.environment;
            default:
              return "white";
          }
        }
      },
      actions: {
        setEnvironmentColor(color: EnvironmentColor) {
          self.environment = color;
        },
        reset() {
          interactive.reset();
          self.chartData.dataSets[0].clearDataPoints();
          self.chartData.dataSets[1].clearDataPoints();
        },
         addData(datum: any) {
          const date = interactive.environment.date;
          self.chartData.dataSets[0].addDataPoint(date, datum.numWhite, "");
          self.chartData.dataSets[1].addDataPoint(date, datum.numBrown, "");
        }
      }
    };
  });

export type MousePopulationsModelType = Instance<typeof MousePopulationsModel>;
