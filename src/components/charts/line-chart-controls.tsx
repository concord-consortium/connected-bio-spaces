import * as React from "react";
import { observer } from "mobx-react";
import { ChartDataModelType } from "../../models/spaces/charts/chart-data";

import "./line-chart-controls.sass";
import { BaseComponent } from "../base";

interface IChartControlProps {
  chartData: ChartDataModelType;
  isPlaying: boolean;
}

interface IChartControlState {
  scrubberPosition: number;
  scrubberMin: number;
  scrubberMax: number;
}

@observer
export class LineChartControls extends BaseComponent<IChartControlProps, IChartControlState> {
  public static getDerivedStateFromProps: any = (nextProps: IChartControlProps, prevState: IChartControlState) => {
    const { chartData, isPlaying } = nextProps;
    const nextState: IChartControlState = {} as any;

    if (isPlaying) {
      nextState.scrubberPosition = chartData.pointCount;

      if (prevState.scrubberMax !== chartData.pointCount) {
        nextState.scrubberMax = chartData.pointCount;
      }
    }
    return nextState;
  }

  public state: IChartControlState = {
    scrubberPosition: 0,
    scrubberMin: 0,
    scrubberMax: 0
  };

  public render() {
    const { chartData, isPlaying } = this.props;
    const { scrubberPosition, scrubberMin, scrubberMax } = this.state;
    const pos = scrubberPosition ? scrubberPosition : 0;
    const timelineVisible = chartData.pointCount > chartData.maxPoints;

    return (
      <div className="line-chart-controls" id="line-chart-controls">
        {timelineVisible &&
          <input type="range" className="scrubber"
            onChange={this.handleDragChange}
            min={scrubberMin}
            max={scrubberMax}
            value={pos}
            disabled={isPlaying}
          />
        }
      </div>
    );
  }

  private handleDragChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { chartData } = this.props;
    const scrubber = e.currentTarget;

    // slider covers whole dataset
    // retrieve maxPoints for subset based on percentage along of the slider

    const sliderPercentage = scrubber.valueAsNumber / chartData.pointCount;
    const dataRangeMax = chartData.pointCount - chartData.maxPoints;

    if (dataRangeMax > 0) {
      const startIdx = Math.round(sliderPercentage * dataRangeMax);
      chartData.setDataSetSubset(startIdx, chartData.maxPoints);
      this.setState({
        scrubberPosition: scrubber.valueAsNumber,
        scrubberMax: chartData.pointCount
      });
    }
  }
}
