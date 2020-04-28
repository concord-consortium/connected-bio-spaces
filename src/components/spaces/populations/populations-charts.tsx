import * as React from "react";
import { Chart } from "../../charts/chart";
import { ChartDataModelType } from "../../../models/spaces/charts/chart-data";

interface IProps {
  chartData: ChartDataModelType;
  isPlaying: boolean;
}

interface IState {}

export class PopulationsCharts extends React.Component<IProps, IState> {

  public render() {
    const { chartData, isPlaying } = this.props;
    return (
      <div className="chart-container">
        <Chart title="Population"
          chartData={chartData}
          chartType={"line"}
          isPlaying={isPlaying}
        />
      </div>
    );
  }
}
