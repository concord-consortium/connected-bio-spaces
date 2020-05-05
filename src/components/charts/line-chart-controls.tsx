import * as React from "react";
import { observer } from "mobx-react";
import { ChartDataModelType } from "../../models/spaces/charts/chart-data";
import Slider from "rc-slider";
import { BaseComponent } from "../base";

// @ts-ignore
import * as colors from "../colors.scss";

import "./line-chart-controls.sass";
import "rc-slider/assets/index.css";

interface IChartControlProps {
  chartData: ChartDataModelType;
  isPlaying: boolean;
  onDragChange: (value: number) => void;
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

    const trackStyle = { backgroundColor: colors.chartColor5, height: 10 };
    const handleStyle = {
      borderColor: colors.chartColor6,
      height: 20,
      width: 20
    };
    const railStyle = { backgroundColor: colors.chartColor7, height: 10 };

    return (
      <Slider className="scrubber"
        trackStyle={trackStyle}
        handleStyle={handleStyle}
        railStyle={railStyle}
        onChange={this.handleDragChange}
        min={scrubberMin}
        max={scrubberMax}
        value={pos}
        disabled={isPlaying}
      />
    );
  }

  private handleDragChange = (value: number) => {
    const { chartData, onDragChange } = this.props;

    this.setState({
      scrubberPosition: value,
      scrubberMax: chartData.pointCount
    });
    onDragChange(value);
  }
}
