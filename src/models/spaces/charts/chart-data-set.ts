import { types, Instance } from "mobx-state-tree";
// @ts-ignore
import * as colors from "../../../components/colors.scss";

export interface Color {
  name: string;
  hex: string;
}

interface XYPoint {
  x: number;
  y: number;
}

export const ChartColors: Color[] = [
  // bars
  { name: "blue", hex: colors.chartDataColor1},
  { name: "orange", hex: colors.chartDataColor2},
  { name: "purple", hex: colors.chartDataColor3},
  { name: "green", hex: colors.chartDataColor4 },
  { name: "sage", hex: colors.chartDataColor5},
  { name: "rust", hex: colors.chartDataColor6},
  { name: "cloud", hex: colors.chartDataColor7},
  { name: "gold", hex: colors.chartDataColor8},
  { name: "terra", hex: colors.chartDataColor9},
  { name: "sky", hex: colors.chartDataColor10},

  // backgrounds
  { name: "sage", hex: colors.chartColor5},
  { name: "rust", hex: colors.chartColor6},
  { name: "cloud", hex: colors.chartColor7},
  { name: "gold", hex: colors.chartColor8},
  { name: "terra", hex: colors.chartColor9},
  { name: "sky", hex: colors.chartColor10}
];

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function timeSeriesSort(a: XYPoint, b: XYPoint) {
  if (a.x < b.x) {
    return -1;
  }
  if (a.x > b.x) {
    return 1;
  }
  return 0;
}

const defaultMax = 100;
const defaultMin = 0;

export const DataPoint = types
  .model("DataPoint", {
    label: types.string,
    a1: types.number,
    a2: types.number
  });

export const ChartDataSetModel = types
  .model("ChartDataSet", {
    name: types.string,
    dataPoints: types.array(DataPoint),
    color: types.string,
    maxPoints: types.number
  })
  .views(self => ({
    // labels for a data point - essential for a bar graph, optional for a line
    get dataLabels() {
      return self.dataPoints.map(p => p.label);
    },
    // Axis 1 data, for a line will be point x value, for bar will be quantity
    get dataA1() {
      return self.dataPoints.map(p => p.a1);
    },
    // Axis 2 data for a line will be y value, for a bar will be label
    get dataA2() {
      if (self.dataPoints.length > 0 && self.dataPoints[0].a2) {
        return self.dataPoints.map(p => p.a2);
      } else {
        return self.dataPoints.map(p => p.label);
      }
    },
    // Determine minimum and maximum values on each axis
    get maxA1(): number | undefined {
      if (!self.dataPoints || self.dataPoints.length === 0) {
        return defaultMax;
      } else {
        return Math.max(...self.dataPoints.map(p => p.a1));
      }
    },
    get maxA2(): number | undefined {
      if (!self.dataPoints || self.dataPoints.length === 0) {
        return defaultMax;
      } else {
        return Math.max(...self.dataPoints.map(p => p.a2));
      }
    },
    get minA1(): number | undefined {
      if (!self.dataPoints || self.dataPoints.length === 0) {
        return defaultMin;
      } else {
        return Math.min(...self.dataPoints.map(p => p.a1));
      }
    },
    get minA2(): number | undefined {
      if (!self.dataPoints || self.dataPoints.length === 0) {
        return defaultMin;
      } else {
        return Math.min(...self.dataPoints.map(p => p.a2));
      }
    },
    // Lines and scatter plots require X and Y coordinates
    get dataAsXY() {
      return self.dataPoints.map(d => ({x: d.a1, y: d.a2}));
    },
    // Sort lines in increasing order of X for time-based plots
    get timeSeriesXY() {
      const xyData = self.dataPoints.map(d => ({ x: d.a1, y: d.a2 }));
      xyData.sort(timeSeriesSort);
      return xyData;
    },
    get colorRGB(): string {
      const colorValues = hexToRgb(self.color);
      if (colorValues) {
        return colorValues.r + "," + colorValues.g + "," + colorValues.b;
      } else {
        return "170, 170, 170";
      }
    }
  }))
  .extend(self => {
    // actions
    function addDataPoint(a1: number, a2: number, label: string) {
      if (self.maxPoints && self.dataPoints && self.dataPoints.length === self.maxPoints) {
        // limit maximum data points and remove oldest point before adding new point
        self.dataPoints.splice(0, 1);
      }
      self.dataPoints.push({ a1, a2, label });
    }

    function updateDataPoint(pointIdx: number, newValA1: number, newValA2: number) {
      if (self.dataPoints[pointIdx]) {
        self.dataPoints[pointIdx].a1 = newValA1;
        self.dataPoints[pointIdx].a2 = newValA2;
      }
    }

    function deleteDataPoint(pointIdx: number) {
      if (self.dataPoints.length > pointIdx) {
        self.dataPoints.splice(pointIdx, 1);
      }
    }

    function changeColor(newColor: string) {
      self.color = newColor;
    }

    function clearDataPoints() {
      self.dataPoints.splice(0, self.dataPoints.length);
    }

    return {
      actions: {
        addDataPoint,
        updateDataPoint,
        deleteDataPoint,
        changeColor,
        clearDataPoints
      }
    };
  });

export type ChartDataSetModelType = Instance<typeof ChartDataSetModel>;
