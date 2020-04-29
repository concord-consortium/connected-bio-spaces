import * as React from "react";
import { Chart } from "../../charts/chart";
import { PieChart, PieChartData } from "../../charts/pie-chart";
import { ChartDataModelType } from "../../../models/spaces/charts/chart-data";
import { observer, inject } from "mobx-react";
import { BaseComponent } from "../../base";
import { MousePopulationsModelType } from "../../../models/spaces/populations/mouse-model/mouse-populations-model";
import { onAction } from "mobx-state-tree";
import { IDisposer } from "mobx-state-tree/dist/utils";

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

  private disposer: IDisposer;

  public constructor(props: IProps) {
    super(props);

    const model = this.stores.populations.model as MousePopulationsModelType;
    this.state = {
      lineChartHeight: model.showPieChart ? MIN_LINE_CHART_HEIGHT : MAX_LINE_CHART_HEIGHT
    };
  }

  public componentDidMount() {
    this.disposer = onAction(this.stores.populations.model, call => {
      if (call.name === "toggleShowPieChart") {
        lastAnimationTime = Date.now();
        requestAnimationFrame(this.animateLineChartHeight);
      }
    });
  }

  public componentWillUnmount() {
    if (this.disposer) this.disposer();
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
            { this.renderPieChart(true) }
            { this.renderPieChart(false) }
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

  private renderPieChart = (initialData: boolean) => {
    if (!this.props.chartData.dataSets.length || !this.props.chartData.dataSets[0].dataPoints.length) {
      return (<div />);
    }

    let pointIdx = 0;
    let date = 0;
    if (!initialData && this.props.chartData.dataSets[0] && this.props.chartData.dataSets[0].dataPoints.length > 0) {
      pointIdx = this.props.chartData.dataSets[0].dataPoints.length - 1;
      date = Math.floor(this.props.chartData.dataSets[0].dataPoints[pointIdx].a1);
    }
    const text = initialData ? "Initial: 0 months" : `Current: ${date} months`;
    // create single array of points, either the first of each dataset or the last
    let data = this.props.chartData.dataSets.filter(ds => ds.display).map(ds => {
        const point = ds.dataPoints[(initialData || !ds.dataPoints.length) ? 0 : ds.dataPoints.length - 1];
        const value = point && !isNaN(point.a2) ? point.a2 : 0;
        return {
          label: ds.name,
          value,
          color: ds.color as string
        };
    }) as PieChartData[];
    data = data.filter(d => d.value);

    return (
      <div className="pie">
        <div className="label">{ text }</div>
        <div>
          <PieChart data={data}/>
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
