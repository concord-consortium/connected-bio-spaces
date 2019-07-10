import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../base";
import { TwoUpDisplayComponent } from "../two-up-display";
import { PopulationsComponent } from "./populations/populations-container";
import { InstructionsComponent } from "../instructions";
import { Chart } from "../charts/chart";
import { RightPanelType } from "../../models/ui";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class PopulationsSpaceComponent extends BaseComponent<IProps, IState> {

  public render() {
    const { populations } = this.stores;
    const rightPanelType = populations.rightPanel;
    const graphPanel = <Chart title="Population"
                          chartData={populations.currentData}
                          chartType={"line"}
                          isPlaying={populations.isPlaying} />;
    const instructionsPanel = <InstructionsComponent content={populations.instructions}/>;
    const rightPanelContent = rightPanelType === "data" ? graphPanel : instructionsPanel;

    return (
      <TwoUpDisplayComponent
        leftTitle="Explore: Population"
        leftPanel={<PopulationsComponent />}
        rightPanel={rightPanelContent}
        instructionsIconEnabled={true}
        dataIconEnabled={true}
        informationIconEnabled={false}
        selectedRightPanel={rightPanelType}
        onClickRightIcon={this.setRightPanel}
        spaceClass="populations"
        rightPanelButtons={populations.graphButtons}
      />
    );
  }

  private setRightPanel = (panelType: RightPanelType) => {
    const { populations } = this.stores;
    populations.setRightPanel(panelType);
  }

}
