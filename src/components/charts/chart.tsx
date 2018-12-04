import * as React from "react";
import { observer } from "mobx-react";
import { BarChart } from "./bar-chart";
import { LineGraph } from "./line-graph";
import { ChartDataModelType } from "../../models/spaces/charts/chart-data";

import "./chart.sass";

export type ChartType = "line" | "bar" | "horizontalBar";

interface IChartProps {
  title: string;
  chartData: ChartDataModelType;
  chartType: ChartType;
  width?: number;
  height?: number;
  isPlaying: boolean;
}

interface IChartState {}

@observer
export class Chart extends React.Component<IChartProps, IChartState> {

  public render() {
    const { chartType, chartData, width, height, isPlaying } = this.props;
    const chart = chartType === "line" ?
      <LineGraph
        chartData={chartData}
        width={this.props.width}
        height={this.props.height}
        isPlaying={isPlaying}
        data-test="line-graph" />
      :
      <BarChart
        chartData={chartData}
        width={width}
        height={height}
        barChartType={chartType}
        data-test="bar-chart"
      />;
    return (
      <div className="chart-container">
        <div className="chart-display" data-test="chart-display">
          {chart}
        </div>
      </div>
    );
  }
}
