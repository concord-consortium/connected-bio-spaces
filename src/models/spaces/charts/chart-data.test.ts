import { ChartDataModel, ChartDataModelType } from "./chart-data";
import { ChartDataSetModel, DataPoint, ChartColors } from "./chart-data-set";

describe("chart data model", () => {
  let chart: ChartDataModelType;

  beforeEach(() => {
    const chartDataSets = [];
    const points = [];
    points.push (DataPoint.create({ a1: 0, a2: 10, label: "alpha" }));
    points.push (DataPoint.create({ a1: 20, a2: 20, label: "bravo" }));
    points.push(DataPoint.create({ a1: 50, a2: 70, label: "charlie" }));

    chartDataSets.push(ChartDataSetModel.create({
      name: "Sample Dataset1",
      data: points,
      color: ChartColors[0].hex
    }));

    chart = ChartDataModel.create({
      name: "Samples",
      data: chartDataSets
    });
  });

  it("has min/max values", () => {
    expect(chart.minMaxAll.minA1).toBe(0);
    expect(chart.minMaxAll.minA2).toBe(10);

    expect(chart.minMaxAll.maxA1).toBe(50);
    expect(chart.minMaxAll.maxA2).toBe(70);
  });

  it("has labels", () => {
    expect(chart.dataLabels).toHaveLength(3);
  });

  it("can produce coordinate data", () => {
    expect(chart.data[0].dataAsXY[0]).toEqual({ x: 0, y: 10 });
  });

  it("can produce label data", () => {
    expect(chart.dataLabels).toEqual(["alpha", "bravo", "charlie"]);
  });

  it("can add new data", () => {
    chart.data[0].addPoint(60, 75, "delta");

    expect(chart.data[0].data.length).toEqual(4);
    expect(chart.data[0].dataAsXY[3]).toEqual({ x: 60, y: 75 });
  });

  it("can update data", () => {
    chart.data[0].updateData(0, 0, 5);
    expect(chart.data[0].dataAsXY[0]).toEqual({ x: 0, y: 5 });
  });

  it("can delete data", () => {
    chart.data[0].deleteDataPoint(1);

    expect(chart.data[0].data.length).toEqual(2);
    expect(chart.data[0].dataAsXY[1]).toEqual({ x: 50, y: 70 });
  });

  it("can store multiple data sets", () => {
    const points = [];
    points.push (DataPoint.create({ a1: 0, a2: 7, label: "alpha" }));
    points.push (DataPoint.create({ a1: 20, a2: 15, label: "bravo" }));
    points.push (DataPoint.create({ a1: 50, a2: 35, label: "charlie" }));

    chart.addDataSet(ChartDataSetModel.create({
      name: "Sample Dataset2",
      data: points,
      color: ChartColors[1].hex
    }));

    expect(chart.data.length).toEqual(2);
    expect(chart.data[1].data.length).toEqual(3);
    expect(chart.data[1].dataAsXY[1]).toEqual({ x: 20, y: 15 });

  });
});
