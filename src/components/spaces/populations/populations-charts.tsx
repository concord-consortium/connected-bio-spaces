import * as React from "react";
import { Chart } from "../../charts/chart";
import { PieChart, PieChartData } from "../../charts/pie-chart";
import { ChartDataModelType } from "../../../models/spaces/charts/chart-data";
import { observer, inject } from "mobx-react";
import { BaseComponent } from "../../base";
import { MousePopulationsModelType } from "../../../models/spaces/populations/mouse-model/mouse-populations-model";
import { onAction } from "mobx-state-tree";
import { IDisposer } from "mobx-state-tree/dist/utils";
import { LineChartControls } from "../../charts/line-chart-controls";

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
  pieChartComparisonIdx: number;
}

@inject("stores")
@observer
export class PopulationsCharts extends BaseComponent<IProps, IState>  {

  private disposer: IDisposer;

  public constructor(props: IProps) {
    super(props);

    if (!this.stores.populations) return;
    const model = this.stores.populations.model as MousePopulationsModelType;
    const lineChartHeight = model.showPieChart ? MIN_LINE_CHART_HEIGHT : MAX_LINE_CHART_HEIGHT;
    this.state = {
      lineChartHeight,
      pieChartComparisonIdx: -1,
    };
    setTimeout(() =>
    props.chartData.setViewHeight(lineChartHeight), 2000);
  }

  public componentDidMount() {
    if (!this.stores.populations) return;
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

  public componentWillReact() {
    const { isPlaying, chartData } = this.props;
    if (isPlaying && chartData.subsetIdx !== -1) {
      chartData.setDataSetSubset(-1, chartData.maxPoints);
    }
    if (isPlaying && this.state.pieChartComparisonIdx >= 0) {
      this.setState({pieChartComparisonIdx: -1});
    }
  }

  public render() {
    if (!this.stores.populations) return null;

    const { chartData, isPlaying } = this.props;
    const model = this.stores.populations.model as MousePopulationsModelType;
    const { showMaxPoints, toggleShowMaxPoints, enablePieChart, showPieChart, toggleShowPieChart } = model;
    const toggleButtonTitle = showMaxPoints ? "Show Recent Data" : "Show All Data";
    const topChartClassName = "top-chart" + (showPieChart ? "" : " hidden");
    const bottomChartClassName = "bottom-chart" + (showPieChart ? " small" : "");
    const sliderIsDisabled = isPlaying ||
      (!showPieChart && !(chartData.maxPoints > 0 && chartData.pointCount > chartData.maxPoints));

    const { pieChartComparisonIdx } = this.state;
    let pointerPercent = 0;
    const pointIdx = pieChartComparisonIdx === -1 ? chartData.pointCount - 1 : pieChartComparisonIdx;
    if (this.props.chartData.dataSets[0].dataPoints[pointIdx]) {
      const pointerVal = this.props.chartData.dataSets[0].dataPoints[pointIdx].a1;
      pointerPercent = (pointerVal / chartData.minMaxAll.maxA1) * 100;
    }

    return (
      <div className="chart-container">
        <div className="chart-header">
          <div>
            { enablePieChart &&
            <div className={"button-holder small-icon" + (showPieChart ? " active" : "")} onClick={toggleShowPieChart}>
              <svg className="icon">
                <use xlinkHref="#icon-pie-chart" />
              </svg>
            </div>
            }
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
          { enablePieChart &&
          <div className={topChartClassName}>
            { this.renderPieChart(true) }
            { this.renderPieChart(false) }
          </div>
          }
          <div className={bottomChartClassName}>
            <Chart
              chartData={chartData}
              chartType={"line"}
              isPlaying={isPlaying}
              hideTitle={true}
              height={this.state.lineChartHeight}
            />
            { showPieChart &&
            <div className="pointer-container">
              <div className="pointer" style={{marginLeft: pointerPercent + "%"}} />
            </div>
            }
            <div className="line-chart-controls" id="line-chart-controls">
              <LineChartControls
                chartData={chartData}
                isPlaying={isPlaying}
                isDisabled={sliderIsDisabled}
                onDragChange={this.handleSliderDragChange}
              />
            </div>
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
      if (this.state.pieChartComparisonIdx === -1) {
        pointIdx = this.props.chartData.dataSets[0].dataPoints.length - 1;
      } else {
        pointIdx = this.state.pieChartComparisonIdx;
      }
      const datum = this.props.chartData.dataSets[0].dataPoints[pointIdx];
      date = datum ? Math.floor(datum.a1) : 0;
    }
    const text = initialData ? "Initial: 0 months" : `Current: ${date} months`;
    // create single array of points, either the first of each dataset or the last
    let data = this.props.chartData.dataSets.filter(ds => ds.display).map(ds => {
      // individual datasets may have fewer points
      const _pointIdx = pointIdx === ds.dataPoints.length ? ds.dataPoints.length - 1 : pointIdx;
      const point = ds.dataPoints[_pointIdx];
      const value = point && !isNaN(point.a2) ? point.a2 : 0;
      return {
        label: ds.name.replace(/ .*/, ""),      // take only first word of label (e.g. "Dark brown" => "Dark")
        value,
        color: ds.color as string
      };
    }) as PieChartData[];
    data = data.filter(d => d.value);

    return (
      <div className="pie">
        { !initialData &&
        <div className="pointer" />
        }
        <div className="label">{ text }</div>
        <div>
          <PieChart data={data}/>
        </div>
      </div>
    );
  }

  private setChartHeight(lineChartHeight: number) {
    this.setState({lineChartHeight});
    this.props.chartData.setViewHeight(lineChartHeight);
  }

  private animateLineChartHeight = () => {
    const model = this.stores.populations!.model as MousePopulationsModelType;
    const height = this.state.lineChartHeight;
    const now = Date.now();
    const timeStepPercent = (now - lastAnimationTime) / animationTime;
    let sizeStep = Math.round((MAX_LINE_CHART_HEIGHT - MIN_LINE_CHART_HEIGHT) * timeStepPercent);
    if (model.showPieChart) {
      sizeStep = Math.ceil(sizeStep) + 3;       // overshoot shrink-speed slightly so as not to get cut off
    }
    lastAnimationTime = now;

    if (model.showPieChart && height > MIN_LINE_CHART_HEIGHT) {
      this.setChartHeight(Math.max(height - sizeStep, MIN_LINE_CHART_HEIGHT));
      requestAnimationFrame(this.animateLineChartHeight);
    } else if (!model.showPieChart && height < MAX_LINE_CHART_HEIGHT) {
      this.setChartHeight(Math.min(height + sizeStep, MAX_LINE_CHART_HEIGHT));
      requestAnimationFrame(this.animateLineChartHeight);
    }
  }

  private handleSliderDragChange = (value: number) => {
    const { chartData } = this.props;
    const model = this.stores.populations!.model as MousePopulationsModelType;
    const { showMaxPoints, showPieChart } = model;

    const pieChartComparisonIdx = Math.min(value, chartData.pointCount - 1);
    this.setState({pieChartComparisonIdx});

    if (!showMaxPoints) {
      let startIdx;
      if (showPieChart) {
        startIdx = Math.max((pieChartComparisonIdx + 1) - chartData.maxPoints, 0);
      } else {
        const slidableRange = chartData.pointCount - chartData.maxPoints;
        const sliderPercentage = value / chartData.pointCount;
        startIdx = Math.round(sliderPercentage * slidableRange);
      }
      chartData.setDataSetSubset(startIdx, chartData.maxPoints);
    }
  }
}
