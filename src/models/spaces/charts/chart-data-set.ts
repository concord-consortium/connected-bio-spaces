import { types, Instance } from "mobx-state-tree";

export interface Color {
  name: string;
  hex: string;
}

export const colors: Color[] = [
  {name: "Aqua",    hex: "#00FFFF"},
  {name: "Black",   hex: "#000000"},
  {name: "Blue",    hex: "#0000FF"},
  {name: "Fuchsia", hex: "#FF00FF"},
  {name: "Gray",    hex: "#808080"},
  {name: "Green",   hex: "#008000"},
  {name: "Lime",    hex: "#00FF00"},
  {name: "Maroon",  hex: "#800000"},
  {name: "Navy",    hex: "#000080"},
  {name: "Olive",   hex: "#808000"},
  {name: "Purple",  hex: "#800080"},
  {name: "Red",     hex: "#FF0000"},
  {name: "Silver",  hex: "#C0C0C0"},
  {name: "Teal",    hex: "#008080"},
  {name: "Yellow",  hex: "#FFFF00"}
];

export const DataPoint = types
  .model("DataPoint", {
    label: types.string,
    a1: types.number,
    a2: types.number
  });

export const ChartDataSetModel = types
  .model("ChartDataSet", {
    name: types.string,
    data: types.array(DataPoint)
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
    // Lines require X and Y coordinates
    get dataAsXY() {
      const xyData: any = [];
      self.data.forEach((d) => {
        xyData.push({ x: d.a1, y: d.a2 });
      });
      return xyData;
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
        self.data.splice(pointIdx);
      }
    }

    return {
      actions: {
        addPoint,
        updateData,
        deleteDataPoint
      }
    };
  });

export type ChartDataSetModelType = Instance<typeof ChartDataSetModel>;
