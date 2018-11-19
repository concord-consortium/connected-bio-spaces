import { ChartDataModel, ChartDataModelType } from "./chart-data";
import { ChartDataSetModel, DataPoint } from "./chart-data-set";

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
      dataPoints: points,
      color: "#ff0000",
      maxPoints: 100
    }));

    chart = ChartDataModel.create({
      name: "Samples",
      dataSets: chartDataSets
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
    expect(chart.dataSets[0].dataAsXY[0]).toEqual({ x: 0, y: 10 });
  });

  it("can produce label data", () => {
    expect(chart.dataLabels).toEqual(["alpha", "bravo", "charlie"]);
  });

  it("can add new data", () => {
    chart.dataSets[0].addDataPoint(60, 75, "delta");

    expect(chart.dataSets[0].dataPoints.length).toEqual(4);
    expect(chart.dataSets[0].dataAsXY[3]).toEqual({ x: 60, y: 75 });
  });

  it("can update data", () => {
    chart.dataSets[0].updateDataPoint(0, 0, 5);
    expect(chart.dataSets[0].dataAsXY[0]).toEqual({ x: 0, y: 5 });
  });

  it("can delete data", () => {
    chart.dataSets[0].deleteDataPoint(1);

    expect(chart.dataSets[0].dataPoints.length).toEqual(2);
    expect(chart.dataSets[0].dataAsXY[1]).toEqual({ x: 50, y: 70 });
  });

  it("can store multiple data sets", () => {
    const points = [];
    points.push (DataPoint.create({ a1: 0, a2: 7, label: "alpha" }));
    points.push (DataPoint.create({ a1: 20, a2: 15, label: "bravo" }));
    points.push (DataPoint.create({ a1: 50, a2: 35, label: "charlie" }));

    chart.addDataSet(ChartDataSetModel.create({
      name: "Sample Dataset2",
      dataPoints: points,
      color: "#00ff00",
      maxPoints: 100
    }));

    expect(chart.dataSets.length).toEqual(2);
    expect(chart.dataSets[1].dataPoints.length).toEqual(3);
    expect(chart.dataSets[1].dataAsXY[1]).toEqual({ x: 20, y: 15 });

  });

  it("can retrieve a subset of data", () => {
    chart.dataSets[0].addDataPoint(65, 75, "delta");
    chart.dataSets[0].addDataPoint(70, 85, "echo");
    chart.dataSets[0].addDataPoint(75, 80, "foxtrot");

    chart.setDataSetSubset(2, 2);

    expect(chart.dataSets[0].dataPoints.length).toEqual(6);
    expect(chart.dataSets[0].dataA1.length).toEqual(2);
    expect(chart.dataSets[0].dataA1[0]).toEqual(50);
    expect(chart.dataSets[0].dataA2[0]).toEqual(70);

    // try getting a point from an index beyond the subset length
    expect(chart.dataSets[0].dataA1[2]).toBeUndefined;
  });
});
