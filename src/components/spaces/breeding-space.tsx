import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../base";
import { TwoUpDisplayComponent } from "../two-up-display";
import { InstructionsComponent } from "../instructions";
import { RightPanelType } from "../../models/ui";
import { BreedingContainer } from "./breeding/breeding-container";
import { BreedingData } from "./breeding/breeding-data";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class BreedingSpaceComponent extends BaseComponent<IProps, IState> {

  public render() {
    const { breeding } = this.stores;
    const rightPanelType = breeding.rightPanel;
    const rightPanelContent = (() => {
      switch (rightPanelType) {
        case "instructions":
          return <InstructionsComponent content={breeding.instructions}/>;
        case "data":
          return <BreedingData/>;
        case "information":
        default:
          return null;
      }
    })();

    return (
      <TwoUpDisplayComponent
        leftTitle="Explore: Nesting Pairs"
        leftPanel={<BreedingContainer />}
        rightPanel={rightPanelContent}
        instructionsIconEnabled={true}
        dataIconEnabled={true}
        informationIconEnabled={false}
        selectedRightPanel={rightPanelType}
        onClickRightIcon={this.setRightPanel}
        spaceClass="breeding"
        rightPanelFooterHeading="Graph:"
        rightPanelButtons={breeding.graphButtons}
      />
    );
  }

  private setRightPanel = (panelType: RightPanelType) => {
    const { breeding } = this.stores;
    breeding.setRightPanel(panelType);
  }
}
