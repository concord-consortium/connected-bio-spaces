import * as React from "react";
import { Chart } from "../../charts/chart";
import { ChartDataModelType } from "../../../models/spaces/charts/chart-data";
import { observer, inject } from "mobx-react";
import { BaseComponent } from "../../base";
import { MousePopulationsModelType } from "../../../models/spaces/populations/mouse-model/mouse-populations-model";

interface IProps {
  chartData: ChartDataModelType;
  isPlaying: boolean;
}

interface IState {}

@inject("stores")
@observer
export class PopulationsCharts extends BaseComponent<IProps, IState>  {

  public render() {
    const { chartData, isPlaying } = this.props;
    const model = this.stores.populations.model as MousePopulationsModelType;
    const { showMaxPoints, toggleShowMaxPoints } = model;
    const toggleButtonTitle = showMaxPoints ? "Show Recent Data" : "Show All Data";
    return (
      <div className="chart-container">
        <div className="chart-header">
          <div className="title">
            { chartData.name }
          </div>
          <div>
            <div className="button-holder" onClick={toggleShowMaxPoints}>
              { toggleButtonTitle }
            </div>
          </div>
        </div>
        <Chart
          chartData={chartData}
          chartType={"line"}
          isPlaying={isPlaying}
          hideTitle={true}
        />
      </div>
    );
  }
}
