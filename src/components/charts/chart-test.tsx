import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../base";
import { Chart, ChartTypes } from "./chart";
import { ChartDataSetModel, DataPoint, ChartColors } from "../../models/spaces/charts/chart-data-set";
import { ChartDataModel, ChartDataModelType } from "../../models/spaces/charts/chart-data";

interface IProps extends IBaseProps {}
interface IState {
  chartType: number;
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
      data: this.addTestDataPoints(),
      color: ChartColors[0].hex
    }));
    chartDataSets.push(ChartDataSetModel.create({
      name: "Sample Dataset2",
      data: this.addTestDataPoints(),
      color: ChartColors[1].hex
    }));
    const chartData: ChartDataModelType = ChartDataModel.create({
      name: "Samples",
      data: chartDataSets
    });
    this.state = { chartType: ChartTypes.Bar, chartData };
  }

  public componentDidMount() {
     _interval = setInterval(this.rngData, 3000);
  }

  public render() {
    const { chartType, chartData } = this.state;
    return (
      <div className="chart-test-panel">
        <div className="content">
          <select value={chartType} onChange={this.handleChangeSelection}>
            <option value={ChartTypes.Line}>Line</option>
            <option value={ChartTypes.HorizontalBar}>Horizontal Bar</option>
            <option value={ChartTypes.Bar}>Bar</option>
          </select>
          <div>
            <Chart title="Chart Test" chartData={chartData} chartType={chartType} />
          </div>
        </div>
        <div className="footer"/>
      </div>
    );
  }

  private handleChangeSelection = (e: any) => {
    const selectedValue = e.currentTarget.value ? e.currentTarget.value : ChartTypes.Bar;
    if (selectedValue !== this.state.chartType) {
      this.setState({ chartType:  parseInt(selectedValue, 10) });
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
    points.push (DataPoint.create({ a1: this.rand(), a2: this.rand(), label: "golf" }));
    return points;
  }

  private rngData = () => {
    const { chartData } = this.state;
    // chartData is an array of chartDataSets
    for (const cdata of chartData.data) {
      for (let i = 0; i < cdata.data.length; i++) {
        cdata.updateData(i, this.rand(), this.rand());
      }
    }
    this.setState({ chartData });
  }

  private rand = () => {
    return Math.round(Math.random() * 100);
  }
}
