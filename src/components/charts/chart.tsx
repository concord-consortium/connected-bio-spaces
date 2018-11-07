import * as React from "react";
import { observer } from "mobx-react";
import { HorizontalBarChart, BarChart } from "./bar-chart";
import { LineGraph } from "./line-graph";
import { ChartDataModel } from "../../models/spaces/charts/chart-data";

import "./chart.sass";

export const ChartTypes = {Line: 0, HorizontalBar: 1, Bar: 2};

interface ChartProps {
  title: string;
  labels: object;
  data: object;
  chartType: number;
}

interface ChartState {}

@observer
export class Chart extends React.Component<ChartProps, ChartState> {

  public render() {
    const { chartType } = this.props;
    console.log(chartType);
    return (
      <div className="chart-container">
        <div className="chart-display">
          {chartType === ChartTypes.Line &&
            <LineGraph />
          }
          {chartType === ChartTypes.HorizontalBar &&
            <HorizontalBarChart />
          }
          {chartType === ChartTypes.Bar &&
            <BarChart />
          }
        </div>
      </div>
    );
  }
}
