import { types, Instance } from "mobx-state-tree";

export interface Color {
  cssName: string;
  name: string;
  hex: string;
}

interface XYPoint {
  x: number;
  y: number;
}
// As defined in vars.sass, no easy way to get these variables in here
// so reluctantly duplicating the definitions.
export const ChartColors: Color[] = [
  // bars
  { name: "blue",   cssName: "color7",  hex: "#00aae2"},
  { name: "orange", cssName: "color8",  hex: "#e98c42"},
  { name: "purple", cssName: "color9",  hex: "#bd599d"},
  { name: "green",  cssName: "color10", hex: "#49b860"},
  // backgrounds
  { name: "sage",   cssName: "color1",  hex: "#c9dab7"},
  { name: "rust",   cssName: "color2",  hex: "#e0b1b3"},
  { name: "cloud",  cssName: "color3",  hex: "#bfbfbf"},
  { name: "gold",   cssName: "color4",  hex: "#e7e4b3"},
  { name: "terra",  cssName: "color5",  hex: "#ecd8a5"},
  { name: "sky",    cssName: "color6",  hex: "#a4cde9" }
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

export const DataPoint = types
  .model("DataPoint", {
    label: types.string,
    a1: types.number,
    a2: types.number
  });

export const ChartDataSetModel = types
  .model("ChartDataSet", {
    name: types.string,
    data: types.array(DataPoint),
    color: types.string
  })
  .views(self => ({
    // labels for a data point - essential for a bar graph, optional for a line
    get dataLabels() {
      return self.data.map(p => p.label);
    },
    // Axis 1 data, for a line will be point x value, for bar will be quantity
    get dataA1() {
      return self.data.map(p => p.a1);
    },
    // Axis 2 data for a line will be y value, for a bar will be label
    get dataA2() {
      if (self.data.length > 0 && self.data[0].a2) {
        return self.data.map(p => p.a2);
      } else {
        return self.data.map(p => p.label);
      }
    },
    // Determine minimum and maximum values on each axis
    get maxA1(): number | undefined {
      return Math.max(...self.data.map(p => p.a1));
    },
    get maxA2(): number | undefined {
      return Math.max(...self.data.map(p => p.a2));
    },
    get minA1(): number | undefined {
      return Math.min(...self.data.map(p => p.a1));
    },
    get minA2(): number | undefined {
      return Math.min(...self.data.map(p => p.a2));
    },
    // Lines and scatter plots require X and Y coordinates
    get dataAsXY() {
      const xyData: XYPoint[] = [];
      self.data.forEach((d) => {
        xyData.push({ x: d.a1, y: d.a2 });
      });
      return xyData;
    },
    // Sort lines in increasing order of X for time-based plots
    get timeSeriesXY() {
      const xyData: XYPoint[] = [];
      self.data.forEach((d) => {
        xyData.push({ x: d.a1, y: d.a2 });
      });
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
    function addPoint(a1: number, a2: number, label: string) {
      self.data.push({a1, a2, label});
    }

    function updateData(pointIdx: number, newValA1: number, newValA2: number) {
      if (self.data[pointIdx]) {
        self.data[pointIdx].a1 = newValA1;
        self.data[pointIdx].a2 = newValA2;
      }
    }

    function deleteDataPoint(pointIdx: number) {
      if (self.data.length > pointIdx) {
        self.data.splice(pointIdx, 1);
      }
    }

    function changeColor(newColor: string) {
      self.color = newColor;
    }

    return {
      actions: {
        addPoint,
        updateData,
        deleteDataPoint,
        changeColor
      }
    };
  });

export type ChartDataSetModelType = Instance<typeof ChartDataSetModel>;
