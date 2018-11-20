import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../base";
import { TwoUpDisplayComponent } from "../two-up-display";
import { FourUpDisplayComponent } from "../four-up-display";
import { PopulationsComponent } from "./populations/populations";
import { CellZoomSpaceComponent } from "./cell-zoom-space";
import OrganelleWrapper from "./cell-zoom/OrganelleWrapper";
import { Chart } from "../charts/chart";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class SampleFourUpSpaceComponent extends BaseComponent<IProps, IState> {

  public render() {
    const {ui, populations} = this.stores;
    const showPopulationGraph = ui.showPopulationGraph;
    const iconId = showPopulationGraph ? "#icon-show-data" : "#icon-show-graph";
    const graphTitle = showPopulationGraph ? "Graph" : "Data";
    const graphPanel = <Chart title="Chart Test" chartData={populations.currentData} chartType={"line"} />;
    const populationsComponent = <TwoUpDisplayComponent
      leftTitle="Investigate: Population"
      leftPanel={<PopulationsComponent />}
      rightTitle={graphTitle}
      rightIcon={iconId}
      rightPanel={graphPanel}
      onClickRightIcon={this.togglePopulationsGraph}
    />;
    const cellZoomComponent = <TwoUpDisplayComponent
      leftTitle="Investigate: Population"
      leftPanel={<OrganelleWrapper elementName="organelle-wrapper" />}
      rightTitle={graphTitle}
      rightIcon={iconId}
      rightPanel={graphPanel}
      onClickRightIcon={this.togglePopulationsGraph}
    />;
    return (
      <FourUpDisplayComponent topRow={populationsComponent} bottomRow={cellZoomComponent} />
    );
  }

  private togglePopulationsGraph = () => {
    const {ui} = this.stores;
    ui.setShowPopulationGraph(!ui.showPopulationGraph);
  }

}
