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
    environment: "rgb(251,235,205)"
  },
  neutral: {
    mice: "#db9e26",
    environment: "rgb(241,216,168)"
  },
  brown: {
    mice: "#795423",
    environment: "rgb(201,187,167)"
  }
};

const chartNames = {
  color: "Fur Color vs Time",
  genotype: "Genotypes vs Time",
  alleles: "Alleles vs Time"
};

const chartData = {
  name: chartNames.color,
  dataSets: [
    {
      name: "White mice",
      dataPoints: [],
      color: dataColors.white.mice,
      maxPoints: 20,
      initialMaxA1: 50,
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
      initialMaxA1: 50,
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
      initialMaxA1: 50,
      fixedMinA2: 0,
      fixedMaxA2: 50,
      expandOnly: true,
      fixedLabelRotation: 0,
      axisLabelA1: "Weeks",
      axisLabelA2: "Number of mice"
    },
    {
      name: "CC",
      dataPoints: [],
      color: "#f4ce83",
      maxPoints: 20,
      initialMaxA1: 100,
      fixedMinA2: 0,
      fixedMaxA2: 100,
      expandOnly: true,
      fixedLabelRotation: 0,
      display: false,
      axisLabelA1: "Weeks",
      axisLabelA2: "Percent (%)"
    },
    {
      name: "CR",
      dataPoints: [],
      color: "#db9e26",
      maxPoints: 20,
      initialMaxA1: 100,
      fixedMinA2: 0,
      fixedMaxA2: 100,
      expandOnly: true,
      fixedLabelRotation: 0,
      display: false,
      axisLabelA1: "Weeks",
      axisLabelA2: "Percent (%)"
    },
    {
      name: "RC",
      dataPoints: [],
      color: "#db9e26",
      maxPoints: 20,
      initialMaxA1: 100,
      fixedMinA2: 0,
      fixedMaxA2: 100,
      expandOnly: true,
      fixedLabelRotation: 0,
      display: false,
      axisLabelA1: "Weeks",
      axisLabelA2: "Percent (%)"
    },
    {
      name: "RR",
      dataPoints: [],
      color: "#795423",
      maxPoints: 20,
      initialMaxA1: 100,
      fixedMinA2: 0,
      fixedMaxA2: 100,
      expandOnly: true,
      fixedLabelRotation: 0,
      display: false,
      axisLabelA1: "Weeks",
      axisLabelA2: "Percent (%)"
    },
    {
      name: "C",
      dataPoints: [],
      color: "#f4ce83",
      maxPoints: 20,
      initialMaxA1: 100,
      fixedMinA2: 0,
      fixedMaxA2: 100,
      expandOnly: true,
      fixedLabelRotation: 0,
      display: false,
      axisLabelA1: "Weeks",
      axisLabelA2: "Percent (%)"
    },
    {
      name: "R",
      dataPoints: [],
      color: "#795423",
      maxPoints: 20,
      initialMaxA1: 100,
      fixedMinA2: 0,
      fixedMaxA2: 100,
      expandOnly: true,
      fixedLabelRotation: 0,
      display: false,
      axisLabelA1: "Weeks",
      axisLabelA2: "Percent (%)"
    }
  ]
 };

const EnvironmentColorTypeEnum = types.enumeration("environment", ["white", "neutral", "brown"]);
export type EnvironmentColorType = typeof EnvironmentColorTypeEnum.Type;

const ChartTypeEnum = types.enumeration("chart", ["color", "genotype", "alleles"]);
export type ChartType = typeof ChartTypeEnum.Type;

export const EnvironmentColorNames = {
  white: "Beach",
  neutral: "Mixed",
  brown: "Field"
};

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
    "showMaxPoints": false,
    "chartType": types.optional(ChartTypeEnum, "color")
  })
  .extend(self => {
    let interactive: HawksMiceInteractive | undefined;
    let lastEnvironmentColorAnnotationDate = 0;
    let lastEnvironmentColorAnnotation: ChartAnnotationType;

    function addData(time: number, datum: any) {
      self.chartData.dataSets[0].addDataPoint(time, datum.numWhite, "");
      self.chartData.dataSets[1].addDataPoint(time, datum.numTan, "");
      self.chartData.dataSets[2].addDataPoint(time, datum.numBrown, "");

      self.chartData.dataSets[3].addDataPoint(time, datum.numCC, "");
      self.chartData.dataSets[4].addDataPoint(time, datum.numCR, "");
      self.chartData.dataSets[5].addDataPoint(time, datum.numRC, "");
      self.chartData.dataSets[6].addDataPoint(time, datum.numRR, "");

      self.chartData.dataSets[7].addDataPoint(time, datum.numC, "");
      self.chartData.dataSets[8].addDataPoint(time, datum.numR, "");
    }

    function displayMaxPoints() {
      self.chartData.dataSets.forEach((dataSet: any) => {
        dataSet.setMaxDataPoints(-1);
      });
    }
    function displayRecentPoints() {
      self.chartData.dataSets.forEach((dataSet: any) => {
        dataSet.setMaxDataPoints(20);
      });
    }

    Events.addEventListener(Environment.EVENTS.START, () => {
      if (interactive) {
        const date = interactive.environment.date;
        if (date === 0) {
          addData(date, interactive.getData());
        }
      }
    });

    Events.addEventListener(Environment.EVENTS.STEP, () => {
      if (interactive) {
        const date = interactive.environment.date;
        // add data every 5th step
        if (date % 5 === 0) {
          addData(date / 2, interactive.getData());
        }
      }
    });

    let hawksAdded = false;
    Events.addEventListener(Environment.EVENTS.AGENT_ADDED, (evt: any) => {
      if (interactive) {
        if (!hawksAdded && evt.detail && evt.detail.agent.species.speciesName === "hawks") {
          const timeSinceLastAnnotation = interactive.environment.date - lastEnvironmentColorAnnotationDate;
          const yOffset = timeSinceLastAnnotation < 30 ? 30 : 0;
          self.chartData.addAnnotation(ChartAnnotationModel.create({
            type: "verticalLine",
            value: interactive.environment.date,
            label: "Hawks added",
            labelXOffset: -50,
            labelYOffset: yOffset
          }));
          hawksAdded = true;
        }
      }
    });

    function addEnvironmentAnnotation(date: number, color: EnvironmentColorType) {
      const now = interactive ? interactive.environment.date : 0;
      const timeSinceLastAnnotation = now - lastEnvironmentColorAnnotationDate;
      if (timeSinceLastAnnotation < 10 && lastEnvironmentColorAnnotation) {
        self.chartData.removeAnnotation(lastEnvironmentColorAnnotation);
      }

      const colorAnnotation = ChartAnnotationModel.create({
        type: "verticalLine",
        value: date,
        color: "black",
        label: "   ",
        expandLabel: EnvironmentColorNames[color],
        labelXOffset: -15,
        expandOffset: -27,
        labelColor: "black",
        labelBackgroundColor: dataColors[color].environment
      });
      self.chartData.addAnnotation(colorAnnotation);
      lastEnvironmentColorAnnotationDate = date;
      lastEnvironmentColorAnnotation = colorAnnotation;
    }

    function setupGraph() {
      self.chartData.dataSets.forEach(d => d.clearDataPoints());
      self.chartData.clearAnnotations();
      hawksAdded = false;
      addEnvironmentAnnotation(0, self.environment);
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
            addEnvironmentAnnotation(interactive.environment.date, color);
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
        setChartType(type: ChartType) {
          self.chartType = type;

          self.chartData.name = chartNames[type];

          self.chartData.dataSets[0].display = type === "color";
          self.chartData.dataSets[1].display = type === "color";
          self.chartData.dataSets[2].display = type === "color";

          self.chartData.dataSets[3].display = type === "genotype";
          self.chartData.dataSets[4].display = type === "genotype";
          self.chartData.dataSets[5].display = type === "genotype";
          self.chartData.dataSets[6].display = type === "genotype";

          self.chartData.dataSets[7].display = type === "alleles";
          self.chartData.dataSets[8].display = type === "alleles";
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
            type: "float-button",
            value: self.showMaxPoints,
            action: (val: boolean) => {
              self.toggleShowMaxPoints();
            },
            floatCorner: "upper-right",
            section: "data"
          });

          buttons.push({
            title: "Graph Fur Colors",
            value: self.chartType === "color",
            action: (val: boolean) => {
              self.setChartType("color");
            },
            section: "data"
          });
          buttons.push({
            title: "Graph Genotypes",
            value: self.chartType === "genotype",
            action: (val: boolean) => {
              self.setChartType("genotype");
            },
            section: "data"
          });
          buttons.push({
            title: "Graph Alleles",
            value: self.chartType === "alleles",
            action: (val: boolean) => {
              self.setChartType("alleles");
            },
            section: "data"
          });

          return buttons;
        }
      }
    };
  });

export type MousePopulationsModelType = Instance<typeof MousePopulationsModel>;
