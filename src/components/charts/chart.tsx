import * as React from "react";
import { observer } from "mobx-react";
import { BarChart } from "./bar-chart";
import { LineGraph } from "./line-graph";
import { ChartDataModelType } from "../../models/spaces/charts/chart-data";

import "./chart.sass";

export type ChartType = "line" | "bar" | "horizontalBar";

interface ChartProps {
  title: string;
  chartData: ChartDataModelType;
  chartType: ChartType;
  width?: number;
  height?: number;
}

interface ChartState {}

@observer
export class Chart extends React.Component<ChartProps, ChartState> {

  public render() {
    const { chartType, chartData } = this.props;
    const chart = chartType === "line" ?
      <LineGraph
        chartData={chartData}
        width={this.props.width}
        height={this.props.height} />
      :
      <BarChart
              chartData={chartData}
              width={this.props.width}
              height={this.props.height}
              barChartType={chartType} />;

    return (
      <div className="chart-container">
        <div className="chart-display">
          {chart}
        </div>
      </div>
    );
  }
}
