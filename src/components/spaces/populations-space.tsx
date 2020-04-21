import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../base";
import { TwoUpDisplayComponent } from "../two-up-display";
import { PopulationsComponent } from "./populations/populations-container";
import { InstructionsComponent } from "../instructions";
import { Chart } from "../charts/chart";
import { RightPanelType } from "../../models/ui";
import { InspectPanel } from "../inspect-panel";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class PopulationsSpaceComponent extends BaseComponent<IProps, IState> {

  public render() {
    const { populations } = this.stores;
    const rightPanelType = populations.rightPanel;
    let rightPanelTitle = "";
    const rightPanelContent = (() => {
      switch (rightPanelType) {
        case "instructions":
          return <InstructionsComponent content={populations.instructions}/>;
        case "data":
          return <Chart title="Population"
                  chartData={populations.currentData}
                  chartType={"line"}
                  isPlaying={populations.isPlaying}
                 />;
        case "information":
          rightPanelTitle = "Inspect: Mouse";
          return <InspectPanel
                  mouse1={populations.model.inspectedMouse}
                  pairLabel={""}
                  isGamete={false}
                  isOffspring={false}
                  isPopulationInspect={true}
                  showGenotype={populations.model.showInspectGenotype}
                 />;
        default:
          return null;
      }
    })();

    return (
      <TwoUpDisplayComponent
        leftTitle="Explore: Population"
        leftPanel={<PopulationsComponent />}
        rightTitle={rightPanelTitle}
        rightPanel={rightPanelContent}
        instructionsIconEnabled={true}
        dataIconEnabled={true}
        informationIconEnabled={true}
        selectedRightPanel={rightPanelType}
        onClickRightIcon={this.setRightPanel}
        spaceClass="populations"
        rightPanelFooterHeading="Graph:"
        rightPanelButtons={populations.graphButtons}
      />
    );
  }

  private setRightPanel = (panelType: RightPanelType) => {
    const { populations } = this.stores;
    populations.setRightPanel(panelType);
  }

}
