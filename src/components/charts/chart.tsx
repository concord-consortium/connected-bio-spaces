import * as React from "react";
import { observer } from "mobx-react";
import { BarChart } from "./bar-chart";
import { LineChart } from "./line-chart";
import { ChartDataModelType } from "../../models/spaces/charts/chart-data";

import "./chart.sass";

export type ChartType = "line" | "bar" | "horizontalBar";

interface IChartProps {
  chartData: ChartDataModelType;
  chartType: ChartType;
  width?: number;
  height?: number;
  isPlaying: boolean;
  hideTitle?: boolean;
  onLineChartSliderDragChange?: (value: number) => void;
}

interface IChartState {}

@observer
export class Chart extends React.Component<IChartProps, IChartState> {

  public render() {
    const { chartType, chartData, width, height, isPlaying, hideTitle, onLineChartSliderDragChange } = this.props;
    if (chartType === "line" && !onLineChartSliderDragChange) {
      throw Error("Slider drag change handler is required for line charts");
    }
    const chart = chartType === "line" ?
      <LineChart
        chartData={chartData}
        width={width}
        height={height}
        isPlaying={isPlaying}
        hideTitle={hideTitle}
        onSliderDragChange={onLineChartSliderDragChange!}
        data-test="line-chart" />
      :
      <BarChart
        chartData={chartData}
        width={width}
        height={height}
        barChartType={chartType}
        hideTitle={hideTitle}
        data-test="bar-chart"
      />;
    return (
      <div className="chart-container">
        {chart}
      </div>
    );
  }
}
