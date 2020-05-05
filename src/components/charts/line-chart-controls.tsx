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
  isDisabled: boolean;
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
      const lastPoint = chartData.pointCount - 1;
      nextState.scrubberPosition = lastPoint;
      if (prevState.scrubberMax !== lastPoint) {
        nextState.scrubberMax = lastPoint;
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
    const { isDisabled } = this.props;
    const { scrubberPosition, scrubberMin, scrubberMax } = this.state;
    const pos = scrubberPosition ? scrubberPosition : 0;

    const trackStyle = {
      backgroundColor: isDisabled ? colors.disabledColor5 :  colors.chartColor5,
      height: 10
    };
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
        disabled={isDisabled}
      />
    );
  }

  private handleDragChange = (value: number) => {
    const { onDragChange } = this.props;

    this.setState({
      scrubberPosition: value
    });
    onDragChange(value);
  }
}
