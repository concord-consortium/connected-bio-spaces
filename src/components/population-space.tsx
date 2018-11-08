import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./population-space.sass";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class PopulationSpaceComponent extends BaseComponent<IProps, IState> {

  public render() {
    return (
      <div className="population-space">
        {this.RenderLeftPanel()}
        {this.RenderRightPanel()}
      </div>
    );
  }

  private RenderLeftPanel() {
    return (
      <div className="population-panel left-abutment">
        <div className="header">
          <div className="title">Investigate: Population</div>
        </div>
        <div className="content">content here</div>
      </div>
    );
  }

  private RenderRightPanel() {
    const {ui} = this.stores;
    const showPopulationGraph: boolean = ui.showPopulationGraph;
    const imageName: string = showPopulationGraph ? "assets/button-show-data.png" :
                                                    "assets/button-show-graph.png";
    const titleText: string = showPopulationGraph ? "Graph" : "Data";
    const contentText: string = showPopulationGraph ? "Graph goes here" :
                                                     "Data goes here";
    return (
      <div className="population-panel right-abutment">

        <div className="header">
          <div className="button-holder" onClick={this.handleClickMode}>
            <img src={imageName} className="button" />
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
