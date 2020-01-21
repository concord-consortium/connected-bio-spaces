import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../base";
import { TwoUpDisplayComponent } from "../two-up-display";
import { PopulationsComponent } from "./populations/populations-container";
import { InstructionsComponent } from "../instructions";
import { RightPanelType } from "../../models/ui";
import { CollectButtonComponent } from "../collect-button";
import { BreedingContainer } from "./breeding/breeding-container";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class OldBreedingSpaceComponent extends BaseComponent<IProps, IState> {

  public render() {
    const { breeding } = this.stores;
    const rightPanelType = breeding.rightPanel;
    const instructionsPanel = <InstructionsComponent content={breeding.instructions}/>;
    const rightPanelContent = rightPanelType === "instructions" ? instructionsPanel : null;

    return (
      <TwoUpDisplayComponent
        leftTitle="Explore: Breeding"
        leftPanel={<BreedingContainer />}
        rightPanel={rightPanelContent}
        instructionsIconEnabled={true}
        dataIconEnabled={false}
        informationIconEnabled={false}
        selectedRightPanel={rightPanelType}
        onClickRightIcon={this.setRightPanel}
        spaceClass="breeding"
      />
    );
  }

  private setRightPanel = (panelType: RightPanelType) => {
    const { populations } = this.stores;
    populations.setRightPanel(panelType);
  }

}
