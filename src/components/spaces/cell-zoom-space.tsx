import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../base";
import { TwoUpDisplayComponent } from "../two-up-display";
import { PopulationsComponent } from "./populations/populations";
import OrganelleWrapper from "./cell-zoom/OrganelleWrapper";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class CellZoomSpaceComponent extends BaseComponent<IProps, IState> {

  public render() {
    const {ui} = this.stores;
    const showPopulationGraph = ui.showPopulationGraph;
    const iconId = showPopulationGraph ? "#icon-show-data" : "#icon-show-graph";
    const graphTitle = showPopulationGraph ? "Graph" : "Data";
    const contentText = showPopulationGraph ? "Graph goes here" :
                                                     "Data goes here";
    const graphPanel = <div>{contentText}</div>;

    return (
      <TwoUpDisplayComponent
        leftTitle="Investigate: Population"
        leftPanel={<OrganelleWrapper elementName="organelle-wrapper" />}
        rightTitle={graphTitle}
        rightIcon={iconId}
        rightPanel={graphPanel}
        onClickRightIcon={this.togglePopulationsGraph}
      />
    );
  }

  private togglePopulationsGraph = () => {
    const {ui} = this.stores;
    ui.setShowPopulationGraph(!ui.showPopulationGraph);
  }

}
