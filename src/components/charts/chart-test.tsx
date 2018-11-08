import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../base";
import { Chart, ChartTypes } from "./chart";
import { ChartDataModel, DataPoint, ChartDataModelType } from "../../models/spaces/charts/chart-data";

interface IProps extends IBaseProps {}
interface IState {
  chartType: number;
  chartData: ChartDataModelType;
 }

@inject("stores")
@observer
export class ChartTest extends BaseComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    const chartData = ChartDataModel.create({
      name: "Sample Dataset",
      data: this.addTestDataPoints()
    });

    this.state = { chartType: ChartTypes.Bar, chartData };

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
    points.push (DataPoint.create({ a1: 65, a2: 75, label: "alpha" }));
    points.push (DataPoint.create({ a1: 59, a2: 49, label: "bravo" }));
    points.push (DataPoint.create({ a1: 80, a2: 90, label: "charlie" }));
    points.push (DataPoint.create({ a1: 81, a2: 29, label: "delta" }));
    points.push (DataPoint.create({ a1: 56, a2: 36, label: "echo" }));
    points.push (DataPoint.create({ a1: 55, a2: 25, label: "foxtrot" }));
    points.push (DataPoint.create({ a1: 40, a2: 18, label: "golf" }));
    return points;
  }
}
