import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../base";
import { TwoUpDisplayComponent } from "../two-up-display";
import { InstructionsComponent } from "../instructions";
import { RightPanelType } from "../../models/ui";
import { BreedingContainer } from "./breeding/breeding-container";
import { BreedingData } from "./breeding/breeding-data";
import { BreedingInspect } from "./breeding/breeding-inspect";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class BreedingSpaceComponent extends BaseComponent<IProps, IState> {

  public render() {
    const { breeding } = this.stores;
    const rightPanelType = breeding.rightPanel;
    const rightPanelTitle = rightPanelType === "information" ?
      (breeding.inspectedNestPairId ? "Inspect: Nesting Pairs" : "Inspect") : "";
    const pairId = breeding.inspectedNestPairId ? breeding.inspectedNestPairId : "";
    const nestPair = breeding.nestPairs.find(pair => pair.id === pairId);
    const mouse1 = nestPair && nestPair.leftMouse;
    const mouse2 = nestPair && nestPair.rightMouse;
    const pairLabel = nestPair ? nestPair.label : "";

    const rightPanelContent = (() => {
      switch (rightPanelType) {
        case "instructions":
          return <InstructionsComponent content={breeding.instructions}/>;
        case "data":
          return <BreedingData/>;
        case "information":
          return <BreedingInspect mouse1={mouse1} mouse2={mouse2} pairLabel={pairLabel}/>;
        default:
          return null;
      }
    })();

    return (
      <TwoUpDisplayComponent
        leftTitle="Explore: Nesting Pairs"
        leftPanel={<BreedingContainer />}
        rightTitle={rightPanelTitle}
        rightPanel={rightPanelContent}
        instructionsIconEnabled={true}
        dataIconEnabled={true}
        informationIconEnabled={true}
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
