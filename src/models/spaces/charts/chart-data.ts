import { types, Instance } from "mobx-state-tree";
import { ChartDataSetModel, ChartDataSetModelType, ChartColors } from "./chart-data-set";

export const ChartDataModel = types
  .model("ChartData", {
    name: types.string,
    dataSets: types.array(ChartDataSetModel)
  })
  .views(self => ({
    // labels for a data point - essential for a bar graph, optional for a line
    get dataLabels() {
      if (self.dataSets && self.dataSets.length > 0) {
        return self.dataSets[0].dataLabels;
      } else return [];
    },
    get dataLabelRotation() {
      if (self.dataSets && self.dataSets.length > 0) {
        return self.dataSets[0].fixedLabelRotation;
      } else return;
    },
    get minMaxAll() {
      const maxA1Values: number[] = [];
      const maxA2Values: number[] = [];
      const minA1Values: number[] = [];
      const minA2Values: number[] = [];

      self.dataSets.forEach((d) => {
        maxA1Values.push(d.maxA1 || 100);
        maxA2Values.push(d.maxA2 || 100);
        minA1Values.push(d.minA1 || 0);
        minA2Values.push(d.minA2 || 0);
      });

      return {
        maxA1: Math.max(...maxA1Values),
        maxA2: Math.max(...maxA2Values),
        minA1: Math.min(...minA1Values),
        minA2: Math.min(...minA2Values),
      };
    },
    get nextDataSeriesColor() {
      return ChartColors[self.dataSets.length];
    }
  }))
  .extend(self => {
    // actions
    function addDataSet(dataSet: ChartDataSetModelType) {
      self.dataSets.push(dataSet);
    }
    // If we want to scrub back and forth along a timeline of data points, but still need
    // to limit our data point quantity for performance, pass a start index and
    // the number of required points to filter the data
    function setDataSetSubset(idx: number, maxPoints: number) {
      self.dataSets.forEach(d => {
        d.subsetPoints(idx);
        d.setMaxDataPoints(maxPoints);
      });
    }
    // To fetch all data from all datasets, remove any subset index points and set the max number of points to -1
    // to ensure all data is returned unfiltered
    function allData() {
      self.dataSets.forEach(d => {
        d.subsetPoints(-1);
        d.setMaxDataPoints(-1);
      });
    }

    return {
      actions: {
        allData,
        addDataSet,
        setDataSetSubset
      }
    };
  });

export type ChartDataModelType = Instance<typeof ChartDataModel>;
