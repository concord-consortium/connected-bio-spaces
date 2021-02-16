import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../base";
import { TwoUpDisplayComponent } from "../two-up-display";
import { PopulationsComponent } from "./populations/populations-container";
import { InstructionsComponent } from "../instructions";
import { RightPanelType } from "../../models/ui";
import { InspectPanel } from "../inspect-panel";
import { PopulationsCharts } from "./populations/populations-charts";
import { units } from "../../models/units";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class PopulationsSpaceComponent extends BaseComponent<IProps, IState> {

  public render() {
    const { populations } = this.stores;
    if (!populations) return null;
    const rightPanelType = populations.rightPanel;
    let rightPanelTitle = "";
    const rightPanelContent = (() => {
      switch (rightPanelType) {
        case "instructions":
          return <InstructionsComponent content={populations.instructions}/>;
        case "data":
          return <PopulationsCharts
                  chartData={populations.currentData}
                  isPlaying={populations.isPlaying}
                 />;
        case "information":
          rightPanelTitle = "Inspect: Mouse";
          return <InspectPanel
                  mouse1={populations.model.inspectedMouse}
                  pairLabel={""}
                  context="population"
                  showGametes={false}
                  isOffspring={false}
                  showGenotype={populations.model.showInspectGenotype}
                 />;
        default:
          return null;
      }
    })();

    const unitDef = units[this.stores.unit];
    const title = unitDef.populations.title;

    return (
      <TwoUpDisplayComponent
        leftTitle={title}
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
    if (populations) {
      populations.setRightPanel(panelType);
    }
  }

}
