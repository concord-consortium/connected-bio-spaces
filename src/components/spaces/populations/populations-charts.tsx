import * as React from "react";
import { Chart } from "../../charts/chart";
import { ChartDataModelType } from "../../../models/spaces/charts/chart-data";
import { observer, inject } from "mobx-react";
import { BaseComponent } from "../../base";
import { MousePopulationsModelType } from "../../../models/spaces/populations/mouse-model/mouse-populations-model";
import { onAction } from "mobx-state-tree";

const MAX_LINE_CHART_HEIGHT = 400;
const MIN_LINE_CHART_HEIGHT = 250;
const animationTime = 500;    // ms
let lastAnimationTime: number;

interface IProps {
  chartData: ChartDataModelType;
  isPlaying: boolean;
}

interface IState {
  lineChartHeight: number;
}

@inject("stores")
@observer
export class PopulationsCharts extends BaseComponent<IProps, IState>  {

  public state = {
    lineChartHeight: MAX_LINE_CHART_HEIGHT
  };

  public constructor(props: IProps) {
    super(props);

    onAction(this.stores.populations.model, call => {
        if (call.name === "toggleShowPieChart") {
          lastAnimationTime = Date.now();
          requestAnimationFrame(this.animateLineChartHeight);
        }
    });
  }

  public render() {
    const { chartData, isPlaying } = this.props;
    const model = this.stores.populations.model as MousePopulationsModelType;
    const { showMaxPoints, toggleShowMaxPoints, showPieChart, toggleShowPieChart } = model;
    const toggleButtonTitle = showMaxPoints ? "Show Recent Data" : "Show All Data";
    const topChartClassName = "top-chart" + (showPieChart ? "" : " hidden");
    const bottomChartClassName = "bottom-chart" + (showPieChart ? " small" : "");
    return (
      <div className="chart-container">
        <div className="chart-header">
          <div>
            <div className={"button-holder small-icon" + (showPieChart ? " active" : "")}>
              <svg className="icon" onClick={toggleShowPieChart}>
                <use xlinkHref="#icon-pie-chart" />
              </svg>
            </div>
          </div>
          <div className="title">
            { chartData.name }
          </div>
          <div>
            <div className="button-holder" onClick={toggleShowMaxPoints}>
              { toggleButtonTitle }
            </div>
          </div>
        </div>
        <div className="charts">
          <div className={topChartClassName}>
            <div>Pie chart</div>
          </div>
          <div className={bottomChartClassName}>
            <Chart
              chartData={chartData}
              chartType={"line"}
              isPlaying={isPlaying}
              hideTitle={true}
              height={this.state.lineChartHeight}
            />
          </div>
        </div>
      </div>
    );
  }

  private animateLineChartHeight = () => {
    const model = this.stores.populations.model as MousePopulationsModelType;
    const height = this.state.lineChartHeight;
    const now = Date.now();
    const timeStepPercent = (now - lastAnimationTime) / animationTime;
    let sizeStep = Math.round((MAX_LINE_CHART_HEIGHT - MIN_LINE_CHART_HEIGHT) * timeStepPercent);
    if (model.showPieChart) {
      sizeStep = Math.ceil(sizeStep) + 3;       // overshoot shrink-speed slightly so as not to get cut off
    }
    lastAnimationTime = now;

    if (model.showPieChart && height > MIN_LINE_CHART_HEIGHT) {
      this.setState({lineChartHeight: Math.max(height - sizeStep, MIN_LINE_CHART_HEIGHT)});
      requestAnimationFrame(this.animateLineChartHeight);
    } else if (!model.showPieChart && height < MAX_LINE_CHART_HEIGHT) {
      this.setState({lineChartHeight: Math.min(height + sizeStep, MAX_LINE_CHART_HEIGHT)});
      requestAnimationFrame(this.animateLineChartHeight);
    }
  }
}