import { types, Instance } from "mobx-state-tree";
import { ChartDataSetModel, ChartDataSetModelType, ChartColors } from "./chart-data-set";

export const ChartDataModel = types
  .model("ChartData", {
    name: types.string,
    data: types.array(ChartDataSetModel)
  })
  .views(self => ({
    // labels for a data point - essential for a bar graph, optional for a line
    get dataLabels() {
      if (self.data && self.data.length > 0) {
        return self.data[0].dataLabels;
      } else return [];
    },
    get minMaxAll() {
      const maxA1Values: number[] = [];
      const maxA2Values: number[] = [];
      const minA1Values: number[] = [];
      const minA2Values: number[] = [];

      self.data.forEach((d) => {
        maxA1Values.push(d.maxA1 || 100);
        maxA2Values.push(d.maxA2 || 100);
        minA1Values.push(d.minA1 || 0);
        minA2Values.push(d.minA2 || 0);
      });

      return {
        maxA1: Math.min(...maxA1Values),
        maxA2: Math.min(...maxA2Values),
        minA1: Math.min(...minA1Values),
        minA2: Math.min(...minA2Values),
      };
    },
    get nextDataSeriesColor() {
      return ChartColors[self.data.length];
    }
  }))
  .extend(self => {
    // actions
    function addDataSet(dataSet: ChartDataSetModelType) {
      self.data.push(dataSet);
    }

    return {
      actions: {
        addDataSet
      }
    };
  });

export type ChartDataModelType = Instance<typeof ChartDataModel>;
