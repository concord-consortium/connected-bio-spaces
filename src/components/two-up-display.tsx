import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./two-up-display.sass";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class TwoUpDisplayComponent extends BaseComponent<IProps, IState> {

  public render() {
    return (
      <div className="two-up-display" data-test="two-up-display">
        {this.renderLeftPanel()}
        {this.renderRightPanel()}
      </div>
    );
  }

  private renderLeftPanel() {
    return (
      <div className="two-up-panel left-abutment" data-test="two-up-left-panel">
        <div className="header" data-test="two-up-header">
          <div className="title" data-test="two-up-title">Investigate: Population</div>
        </div>
        <div className="content" data-test="two-up-content">content here</div>
      </div>
    );
  }

  private renderRightPanel() {
    const {ui} = this.stores;
    const showPopulationGraph: boolean = ui.showPopulationGraph;
    const iconId: string = showPopulationGraph ? "#icon-show-data" : "#icon-show-graph";
    const titleText: string = showPopulationGraph ? "Graph" : "Data";
    const contentText: string = showPopulationGraph ? "Graph goes here" :
                                                     "Data goes here";
    return (
      <div className="two-up-panel right-abutment">
        <div className="header">
          <div className="button-holder" onClick={this.handleClickMode}>
            <svg className="button">
              <use xlinkHref={iconId} />
            </svg>
          </div>
          <div className="title">{titleText}</div>
        </div>
        <div className="content">{contentText}</div>
      </div>
    );
  }

  private handleClickMode = () => {
    const {ui} = this.stores;
    ui.setShowPopulationGraph(!ui.showPopulationGraph);
  }
}
