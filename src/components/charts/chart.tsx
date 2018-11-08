import * as React from "react";
import { observer } from "mobx-react";
import { HorizontalBarChart, BarChart } from "./bar-chart";
import { LineGraph } from "./line-graph";
import { ChartDataModel, ChartDataModelType } from "../../models/spaces/charts/chart-data";

import "./chart.sass";

export const ChartTypes = {Line: 0, HorizontalBar: 1, Bar: 2};

interface ChartProps {
  title: string;
  chartData: ChartDataModelType;
  chartType: number;
}

interface ChartState {}

@observer
export class Chart extends React.Component<ChartProps, ChartState> {

  public render() {
    const { chartType, chartData } = this.props;
    return (
      <div className="chart-container">
        <div className="chart-display">
          {chartType === ChartTypes.Line &&
            <LineGraph chartData={chartData} />
          }
          {chartType === ChartTypes.HorizontalBar &&
            <HorizontalBarChart chartData={chartData} />
          }
          {chartType === ChartTypes.Bar &&
            <BarChart chartData={chartData} />
          }
        </div>
      </div>
    );
  }
}
