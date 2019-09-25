import { types, Instance } from "mobx-state-tree";
import { createInteractive, HawksMiceInteractive } from "./hawks-mice-interactive";
import { Events, Environment } from "populations.js";
import { ToolbarButton } from "../populations";
import { ChartDataModel } from "../../charts/chart-data";
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
      name: "Light Brown",
      dataPoints: [],
      color: dataColors.white.mice,
      maxPoints: 25,
      initialMaxA1: 12,
      fixedMinA2: 0,
      fixedMaxA2: 50,
      expandOnly: true,
      fixedLabelRotation: 0,
      axisLabelA1: "Months",
      axisLabelA2: "Number of mice"
    },
    {
      name: "Medium Brown",
      dataPoints: [],
      color: dataColors.neutral.mice,
      maxPoints: 25,
      initialMaxA1: 12,
      fixedMinA2: 0,
      fixedMaxA2: 50,
      expandOnly: true,
      fixedLabelRotation: 0,
      axisLabelA1: "Months",
      axisLabelA2: "Number of mice"
    },
    {
      name: "Dark Brown",
      dataPoints: [],
      color: dataColors.brown.mice,
      maxPoints: 25,
      initialMaxA1: 12,
      fixedMinA2: 0,
      fixedMaxA2: 50,
      expandOnly: true,
      fixedLabelRotation: 0,
      axisLabelA1: "Months",
      axisLabelA2: "Number of mice"
    },
    {
      name: "CC Mice",
      dataPoints: [],
      color: "#f4ce83",
      maxPoints: 25,
      initialMaxA1: 12,
      fixedMinA2: 0,
      fixedMaxA2: 100,
      expandOnly: true,
      fixedLabelRotation: 0,
      display: false,
      axisLabelA1: "Months",
      axisLabelA2: "Percent (%)"
    },
    {
      name: "CR Mice",
      dataPoints: [],
      color: "#db9e26",
      maxPoints: 25,
      initialMaxA1: 12,
      fixedMinA2: 0,
      fixedMaxA2: 100,
      expandOnly: true,
      fixedLabelRotation: 0,
      display: false,
      axisLabelA1: "Months",
      axisLabelA2: "Percent (%)"
    },
    {
      name: "RC Mice",
      dataPoints: [],
      color: "#db9e26",
      maxPoints: 25,
      initialMaxA1: 12,
      fixedMinA2: 0,
      fixedMaxA2: 100,
      expandOnly: true,
      fixedLabelRotation: 0,
      display: false,
      axisLabelA1: "Months",
      axisLabelA2: "Percent (%)"
    },
    {
      name: "RR Mice",
      dataPoints: [],
      color: "#795423",
      maxPoints: 25,
      initialMaxA1: 12,
      fixedMinA2: 0,
      fixedMaxA2: 100,
      expandOnly: true,
      fixedLabelRotation: 0,
      display: false,
      axisLabelA1: "Months",
      axisLabelA2: "Percent (%)"
    },
    {
      name: "C Alleles",
      dataPoints: [],
      color: "#f4ce83",
      maxPoints: 25,
      initialMaxA1: 12,
      fixedMinA2: 0,
      fixedMaxA2: 100,
      expandOnly: true,
      fixedLabelRotation: 0,
      display: false,
      axisLabelA1: "Months",
      axisLabelA2: "Percent (%)"
    },
    {
      name: "R Alleles",
      dataPoints: [],
      color: "#795423",
      maxPoints: 25,
      initialMaxA1: 12,
      fixedMinA2: 0,
      fixedMaxA2: 100,
      expandOnly: true,
      fixedLabelRotation: 0,
      display: false,
      axisLabelA1: "Months",
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
    "enableColorChart": true,
    "enableGenotypeChart": true,
    "enableAllelesChart": true,
    "deadMice.chanceOfShowingBody": types.number,
    "deadMice.timeToShowBody": types.number
  })
  .volatile(self => ({
    hawksAdded: false,
    userChartType: undefined as (ChartType | undefined)
  }))
  .extend(self => {
    let interactive: HawksMiceInteractive | undefined;
    let lastEnvironmentColorAnnotationDate = 0;
    let lastEnvironmentColorAnnotation: ChartAnnotationType;

    function getChartTypeOrDefault() {
      return self.userChartType ? self.userChartType :
      self.enableColorChart ? "color" :
      self.enableGenotypeChart ? "genotype" :
      self.enableAllelesChart ? "alleles" : "color";
    }

    function setupChartForChartType() {
      const chartString = getChartTypeOrDefault();
      self.chartData.name = chartNames[chartString as ChartType];

      self.chartData.dataSets[0].display = chartString === "color";
      self.chartData.dataSets[1].display = chartString === "color";
      self.chartData.dataSets[2].display = chartString === "color";

      self.chartData.dataSets[3].display = chartString === "genotype";
      self.chartData.dataSets[4].display = chartString === "genotype";
      self.chartData.dataSets[5].display = chartString === "genotype";
      self.chartData.dataSets[6].display = chartString === "genotype";

      self.chartData.dataSets[7].display = chartString === "alleles";
      self.chartData.dataSets[8].display = chartString === "alleles";
    }
    setupChartForChartType();

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

    function getModelDate() {
      if (interactive) {
        return interactive.environment.date / 10;
      }
      return 0;
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
          addData(getModelDate(), interactive.getData());
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
        value: getModelDate(),
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
      addEnvironmentAnnotation(0, self.environment);
      if (interactive) {
        addData(getModelDate(), interactive.getData());
      }
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

        get chartType(): ChartType {
          return getChartTypeOrDefault();
        },

        get chanceOfMutation() {
          if (!self["inheritance.breedWithMutations"]) {
            return 0;
          }
          return self["inheritance.chanceOfMutations"] / 100;
        },

        get modelDate() {
          return getModelDate();
        },

        get chanceOfShowingBody() {
          return self["deadMice.chanceOfShowingBody"] / 100;
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
          this.setHawksAdded(false);
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
          self.userChartType = type;
          setupChartForChartType();
        },
        setHawksAdded(val: boolean) {
          self.hawksAdded = val;
        },
        destroyInteractive() {
          interactive = undefined;
          setupGraph();
        }
      }
    };
  })
  .extend(self => {
    function addHawksAnnotation(added: boolean) {
      const label = added ? "Hawks added" : "Hawks removed";
      const labelXOffset = added ? -50 : -60;
      self.chartData.addAnnotation(ChartAnnotationModel.create({
        type: "verticalLine",
        value: self.modelDate,
        label,
        labelXOffset,
        labelYOffset: 30
      }));
    }
    return {
      views: {
        get toolbarButtons(): ToolbarButton[] {
          const buttons = [];

          if (!self.hawksAdded) {
            buttons.push({
              title: "Add",
              iconName: "icon-add-hawks",
              action: (e: any) => {
                self.interactive.addInitialHawksPopulation(self.numHawks);
                self.setHawksAdded(true);
                addHawksAnnotation(true);
              },
              enabled: (self.numHawks > 0)
            });
          } else {
            buttons.push({
              title: "Remove",
              iconName: "icon-remove-hawks",
              action: (e: any) => {
                self.interactive.removeHawks();
                self.setHawksAdded(false);
                addHawksAnnotation(false);
              },
              enabled: (self.numHawks > 0)
            });
          }

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
            title: "Fur Colors",
            value: self.chartType === "color",
            action: (val: boolean) => {
              self.setChartType("color");
            },
            section: "data",
            disabled: !self.enableColorChart
          });
          buttons.push({
            title: "Genotypes",
            value: self.chartType === "genotype",
            action: (val: boolean) => {
              self.setChartType("genotype");
            },
            section: "data",
            disabled: !self.enableGenotypeChart
          });
          buttons.push({
            title: "Alleles",
            value: self.chartType === "alleles",
            action: (val: boolean) => {
              self.setChartType("alleles");
            },
            section: "data",
            disabled: !self.enableAllelesChart
          });

          return buttons;
        }
      }
    };
  });

export type MousePopulationsModelType = Instance<typeof MousePopulationsModel>;
