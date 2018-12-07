import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../base";
import { TwoUpDisplayComponent } from "../two-up-display";
import { PopulationsComponent } from "./populations/populations-container";
import { InstructionsComponent } from "../instructions";
import { Chart } from "../charts/chart";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class PopulationsSpaceComponent extends BaseComponent<IProps, IState> {

  public render() {
    const {ui, populations} = this.stores;
    const showPopulationGraph = ui.showPopulationGraph;
    const iconId = showPopulationGraph ? "#icon-show-data" : "#icon-show-graph";
    const graphTitle = showPopulationGraph ? "Graph" : "Instructions";
    const graphPanel = <Chart title="Chart Test" chartData={populations.currentData} chartType={"line"} />;
    const instructionsPanel = <InstructionsComponent content={populations.instructions}/>;
    const rightPanelContent = ui.showPopulationGraph ? graphPanel : instructionsPanel;

    return (
      <TwoUpDisplayComponent
        leftTitle="Explore: Population"
        leftPanel={<PopulationsComponent />}
        rightTitle={graphTitle}
        rightIcon={iconId}
        rightPanel={rightPanelContent}
        onClickRightIcon={this.togglePopulationsGraph}
      />
    );
  }

  private togglePopulationsGraph = () => {
    const {ui} = this.stores;
    ui.setShowPopulationGraph(!ui.showPopulationGraph);
  }

}
