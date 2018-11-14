import * as React from "react";
import { observer } from "mobx-react";
import { HorizontalBarChart, BarChart } from "./bar-chart";
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
    return (
      <div className="chart-container">
        <div className="chart-display">
          {chartType === "line" &&
            <LineGraph chartData={chartData} width={this.props.width} height={this.props.height}/>
          }
          {chartType === "horizontalBar" &&
            <HorizontalBarChart chartData={chartData} width={this.props.width} height={this.props.height}/>
          }
          {chartType === "bar" &&
            <BarChart chartData={chartData} width={this.props.width} height={this.props.height}/>
          }
        </div>
      </div>
    );
  }
}
