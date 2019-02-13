import { types, Instance } from "mobx-state-tree";
import { createInteractive, HawksMiceInteractive } from "./hawks-mice-interactive";
import { Interactive, Events, Environment, Agent } from "populations.js";
import { ToolbarButton } from "../populations";
import { ChartDataModel } from "../../charts/chart-data";
import { hawkSpecies } from "./hawks";
import { ChartAnnotationModel, ChartAnnotationType } from "../../charts/chart-annotation";

const dataColors = {
  white: {
    mice: "#f4ce83",
    environment: "rgba(251,235,205, 0.5)"
  },
  neutral: {
    mice: "#db9e26",
    environment: "rgba(241,216,168, 0.5)"
  },
  brown: {
    mice: "#795423",
    environment: "rgba(201,187,167, 0.5)"
  }
};

const chartData = {
  name: "Fur Color vs Time",
  dataSets: [
    {
      name: "White mice",
      dataPoints: [],
      color: dataColors.white.mice,
      maxPoints: 20,
      initialMaxA1: 100,
      fixedMinA2: 0,
      fixedMaxA2: 50,
      expandOnly: true,
      fixedLabelRotation: 0,
      axisLabelA1: "Weeks",
      axisLabelA2: "Number of mice"
    },
    {
      name: "Tan mice",
      dataPoints: [],
      color: dataColors.neutral.mice,
      maxPoints: 20,
      initialMaxA1: 100,
      fixedMinA2: 0,
      fixedMaxA2: 50,
      expandOnly: true,
      fixedLabelRotation: 0,
      axisLabelA1: "Weeks",
      axisLabelA2: "Number of mice"
    },
    {
      name: "Brown mice",
      dataPoints: [],
      color: dataColors.brown.mice,
      maxPoints: 20,
      initialMaxA1: 100,
      fixedMinA2: 0,
      fixedMaxA2: 50,
      expandOnly: true,
      fixedLabelRotation: 0,
      axisLabelA1: "Weeks",
      axisLabelA2: "Number of mice"
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
    "inheritance.breedWithInheritance": types.boolean,
    "inheritance.randomOffspring.white": types.number,
    "inheritance.randomOffspring.tan": types.number,
    "showSexStack": false,
    "showHeteroStack": false,
    "chartData": types.optional(ChartDataModel, chartData),
    "showMaxPoints": false
  })
  .extend(self => {
    let interactive: HawksMiceInteractive | undefined;

    function addData(time: number, datum: any) {
      self.chartData.dataSets[0].addDataPoint(time, datum.numWhite, "");
      self.chartData.dataSets[1].addDataPoint(time, datum.numTan, "");
      self.chartData.dataSets[2].addDataPoint(time, datum.numBrown, "");
      if (self.showMaxPoints) {
        displayMaxPoints();
      }
    }

    function displayMaxPoints() {
      self.chartData.dataSets.forEach((dataSet: any) => {
        dataSet.setMaxDataPoints(dataSet.dataPoints.length);
      });
    }
    function displayRecentPoints() {
      self.chartData.dataSets.forEach((dataSet: any) => {
        dataSet.setMaxDataPoints(20);
      });
    }

    Events.addEventListener(Environment.EVENTS.STEP, () => {
      if (interactive) {
        const date = interactive.environment.date;
        // add data every 5th step
        if (date % 5 === 0) {
          addData(date, interactive.getData());
        }
      }
    });

    let hawksAdded = false;
    Events.addEventListener(Environment.EVENTS.AGENT_ADDED, (evt: any) => {
      if (interactive) {
        if (!hawksAdded && evt.detail && evt.detail.agent.species.speciesName === "hawks") {
          self.chartData.addAnnotation(ChartAnnotationModel.create({
            type: "verticalLine",
            value: interactive.environment.date,
            dashArray: [10, 3],
            label: "Hawks added",
            labelOffset: -50
          }));
          hawksAdded = true;
        }
      }
    });

    let lastBoxAnnotation: ChartAnnotationType;

    function setupGraph() {
      self.chartData.dataSets[0].clearDataPoints();
      self.chartData.dataSets[1].clearDataPoints();
      self.chartData.dataSets[2].clearDataPoints();
      self.chartData.clearAnnotations();
      hawksAdded = false;
      lastBoxAnnotation = ChartAnnotationModel.create({
        type: "box",
        color: dataColors[self.environment].environment,
        xMin: 0,
        xMax: Infinity,
        yMin: 0,
        yMax: Infinity
      });
      self.chartData.addAnnotation(lastBoxAnnotation);
    }

    setupGraph();

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
          if (interactive) {
            const date = interactive.environment.date;
            lastBoxAnnotation.setBounds({xMax: date});
            lastBoxAnnotation = ChartAnnotationModel.create({
              type: "box",
              color: dataColors[color].environment,
              xMin: date,
              xMax: Infinity,
              yMin: 0,
              yMax: Infinity
            });
            self.chartData.addAnnotation(lastBoxAnnotation);
          }
        },
        setBreedWithMutations(value: boolean) {
          self["inheritance.breedWithMutations"] = value;
        },
        setBreedWithInheritance(value: boolean) {
          self["inheritance.breedWithInheritance"] = value;
        },
        reset() {
          if (interactive) {
            interactive.reset();
          }
          setupGraph();
        },
        toggleShowMaxPoints() {
          self.showMaxPoints = !self.showMaxPoints;
          if (self.showMaxPoints) {
            displayMaxPoints();
          } else {
            displayRecentPoints();
          }
        },
        setShowSexStack(show: boolean) {
          self.showSexStack = show;
        },
        setShowHeteroStack(show: boolean) {
          self.showHeteroStack = show;
        },
        destroyInteractive() {
          interactive = undefined;
          setupGraph();
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
            title: "Add",
            action: (e: any) => {
              self.interactive.addInitialHawksPopulation(self.numHawks);
            }
          });

          buttons.push({
            title: "Change",
            action: (e: any) => {
              self.interactive.switchEnvironments(self.includeNeutralEnvironment);
            },
            enabled: self.showSwitchEnvironmentsButton
          });

          buttons.push({
            title: "Females",
            imageClass: "circle female",
            secondaryTitle: "Males",
            secondaryTitleImageClass: "circle male",
            type: "checkbox",
            value: self.showSexStack,
            action: (val: boolean) => {
              self.setShowSexStack(val);
            }
          });

          buttons.push({
            title: "Heterozygotes",
            imageClass: "circle heterozygote",
            type: "checkbox",
            value: self.showHeteroStack,
            action: (val: boolean) => {
              self.setShowHeteroStack(val);
            }
          });

          buttons.push({
            title: "Mutations",
            type: "checkbox",
            value: self["inheritance.breedWithMutations"],
            action: (val: boolean) => {
              self.setBreedWithMutations(val);
            },
            enabled: self["inheritance.showStudentControlOfMutations"]
          });

          buttons.push({
            title: "Inheritance",
            type: "checkbox",
            value: self["inheritance.breedWithInheritance"],
            action: (val: boolean) => {
              self.setBreedWithInheritance(val);
            },
            enabled: self["inheritance.showStudentControlOfInheritance"]
          });

          return buttons;
        },
        get graphButtons(): ToolbarButton[] {
          const buttons = [];

          buttons.push({
            title: "Scale",
            value: self.showMaxPoints,
            action: (val: boolean) => {
              self.toggleShowMaxPoints();
            }
          });

          return buttons;
        }
      }
    };
  });

export type MousePopulationsModelType = Instance<typeof MousePopulationsModel>;
