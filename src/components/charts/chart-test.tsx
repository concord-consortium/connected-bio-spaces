import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../base";
import { Chart, ChartType } from "./chart";
import { ChartDataSetModel, DataPoint, ChartColors } from "../../models/spaces/charts/chart-data-set";
import { ChartDataModel, ChartDataModelType } from "../../models/spaces/charts/chart-data";

interface IProps extends IBaseProps {}
interface IState {
  chartType: ChartType;
  chartData: ChartDataModelType;
 }
let _interval;
@inject("stores")
@observer
export class ChartTest extends BaseComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    const chartDataSets = [];
    chartDataSets.push(ChartDataSetModel.create({
      name: "Sample Dataset1",
      dataPoints: this.addTestDataPoints(),
      backgroundOpacity: 0.9,
      // color: ChartColors[3].hex,
      // pointColors: ["#00ff00", "#ff0000", "#0000ff"],
      maxPoints: 100
    }));
    chartDataSets.push(ChartDataSetModel.create({
      name: "Sample Dataset2",
      dataPoints: this.addTestDataPoints(),
      // color: "#00ffcc",
      // pointColors: ["#00ff00", "#ff0000", "#0000ff"],
      backgroundOpacity: 0.3,
      maxPoints: 100
    }));
    const chartData: ChartDataModelType = ChartDataModel.create({
      name: "Samples",
      dataSets: chartDataSets
    });
    this.state = { chartType: "bar", chartData };
  }

  public componentDidMount() {
     _interval = setInterval(this.rngData, 3000);
  }

  public render() {
    const { chartType, chartData } = this.state;
    return (
      <div className="chart-test-panel">
        <div className="content">
          <select value={chartType} onChange={this.handleChangeSelection} data-test="chart-type">
            <option value={"line"} data-test="line-option">Line</option>
            <option value={"horizontalBar"} data-test="horizontalBar-option">Horizontal Bar</option>
            <option value={"bar"} data-test="bar-option">Bar</option>
          </select>
          <div>
            <Chart title="Chart Test" chartData={chartData} chartType={chartType} isPlaying={false} />
          </div>
        </div>
        <div className="footer"/>
      </div>
    );
  }

  private handleChangeSelection = (e: any) => {
    const selectedValue = e.currentTarget.value ? e.currentTarget.value : "bar";
    if (selectedValue !== this.state.chartType) {
      this.setState({ chartType:  selectedValue });
    }
  }

  private addTestDataPoints = () => {
    const points = [];
    points.push (DataPoint.create({ a1: this.rand(), a2: this.rand(), label: "alpha" }));
    points.push (DataPoint.create({ a1: this.rand(), a2: this.rand(), label: "bravo" }));
    points.push (DataPoint.create({ a1: this.rand(), a2: this.rand(), label: "charlie" }));
    points.push (DataPoint.create({ a1: this.rand(), a2: this.rand(), label: "delta" }));
    points.push (DataPoint.create({ a1: this.rand(), a2: this.rand(), label: "echo" }));
    points.push (DataPoint.create({ a1: this.rand(), a2: this.rand(), label: "foxtrot" }));
    points.push(DataPoint.create({ a1: this.rand(), a2: this.rand(), label: "golf" }));
    points.push (DataPoint.create({ a1: this.rand(), a2: this.rand(), label: "hotel" }));
    points.push (DataPoint.create({ a1: this.rand(), a2: this.rand(), label: "india" }));
    points.push (DataPoint.create({ a1: this.rand(), a2: this.rand(), label: "juliette" }));
    points.push (DataPoint.create({ a1: this.rand(), a2: this.rand(), label: "kilo" }));
    points.push (DataPoint.create({ a1: this.rand(), a2: this.rand(), label: "lima" }));
    points.push (DataPoint.create({ a1: this.rand(), a2: this.rand(), label: "mike" }));
    points.push (DataPoint.create({ a1: this.rand(), a2: this.rand(), label: "november" }));
    return points;
  }

  private rngData = () => {
    const { chartData } = this.state;
    // chartData is an array of chartDataSets
    for (const cdata of chartData.dataSets) {
      for (let i = 0; i < cdata.dataPoints.length; i++) {
        cdata.updateDataPoint(i, this.rand(), this.rand());
      }
    }
    this.setState({ chartData });
  }

  private rand = () => {
    return Math.round(Math.random() * 100);
  }
}
