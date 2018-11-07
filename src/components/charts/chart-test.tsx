import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../base";
import { Chart, ChartTypes } from "./chart";

interface IProps extends IBaseProps {}
interface IState {
  chartType: number;
 }

@inject("stores")
@observer
export class ChartTest extends BaseComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { chartType: ChartTypes.Bar };

  }
  public render() {
    const { chartType } = this.state;
    return (
      <div className="chart-test-panel">
        <div className="header">
          <div className="title">Chart Test</div>
          <div className="close" onClick={this.handleClickClose}>x</div>
        </div>
        <div className="content">
          <select value={chartType} onChange={this.handleChangeSelection}>
            <option value={ChartTypes.Line}>Line</option>
            <option value={ChartTypes.HorizontalBar}>Horizontal Bar</option>
            <option value={ChartTypes.Bar}>Bar</option>
          </select>
          <div>
            <Chart title="Chart Test" labels={["a", "b", "c"]} data={[1, 2, 3]} chartType={chartType} />
          </div>
        </div>
        <div className="footer"/>
      </div>
    );
  }

  private handleChangeSelection = (e: any) => {
    const selectedValue = e.currentTarget.value ? e.currentTarget.value : ChartTypes.Bar;
    if (selectedValue !== this.state.chartType) {
      this.setState({ chartType:  parseInt(selectedValue, 10) });
    }
  }

  private handleClickClose = () => {
    const {ui} = this.stores;
    { ui.setShowInvestigationPanel(!ui.setShowInvestigationPanel); }
  }
}
