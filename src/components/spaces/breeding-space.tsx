import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../base";
import { TwoUpDisplayComponent } from "../two-up-display";
import { InstructionsComponent } from "../instructions";
import { RightPanelType } from "../../models/ui";
import { BreedingContainer } from "./breeding/breeding-container";
import { BreedingData } from "./breeding/breeding-data";
import { BreedingInspect } from "./breeding/breeding-inspect";

interface InspectContent { title: string; mouse1: any; mouse2: any; label: string; isOffspring: boolean; }

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class BreedingSpaceComponent extends BaseComponent<IProps, IState> {

  public render() {
    const { breeding } = this.stores;
    const { rightPanel } = breeding;
    let rightPanelTitle = "";
    const rightPanelContent = (() => {
      switch (rightPanel) {
        case "instructions":
          return <InstructionsComponent content={breeding.instructions}/>;
        case "data":
          return <BreedingData/>;
        case "information":
          const content: InspectContent = this.getInspectedContent();
          rightPanelTitle = content.title;
          return <BreedingInspect
                  mouse1={content.mouse1}
                  mouse2={content.mouse2}
                  pairLabel={content.label}
                  isOffspring={content.isOffspring}
                 />;
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
        selectedRightPanel={rightPanel}
        onClickRightIcon={this.setRightPanel}
        spaceClass="breeding"
        rightPanelFooterHeading="Graph:"
        rightPanelButtons={breeding.graphButtons}
      />
    );
  }

  private getInspectedContent = () => {
    const { breeding } = this.stores;
    const { inspectInfo, nestPairs } = breeding;
    const content: InspectContent = { title: "",
                                    mouse1: undefined,
                                    mouse2: undefined,
                                    label: "",
                                    isOffspring: false
                                  };
    let inspectedName = "Nesting Pairs";
    if (inspectInfo && inspectInfo.type === "nest") {
      const pairId = inspectInfo.nestPairId;
      const nestPair = nestPairs.find(pair => pair.id === pairId);
      content.mouse1 = nestPair && nestPair.leftMouse;
      content.mouse2 = nestPair && nestPair.rightMouse;
      content.label = nestPair ? nestPair.label : "Pair";
    } else if (inspectInfo && (inspectInfo.type === "organism" || inspectInfo.type === "gamete")) {
      const pairId = inspectInfo.nestPairId;
      const nestPairIndex = nestPairs.findIndex(pair => pair.id === pairId);
      const nestPair = nestPairs[nestPairIndex];
      if (nestPair) {
        if (inspectInfo.isParent) {
          if (nestPair.leftMouse.id === inspectInfo.organismId) {
            content.mouse1 = nestPair.leftMouse;
            inspectedName = `Pair ${nestPairIndex + 1} ${content.mouse1.sex === "female" ? "Mother" : "Father"}`;
          } else if (nestPair.rightMouse.id === inspectInfo.organismId) {
            content.mouse1 = nestPair.rightMouse;
            inspectedName = `Pair ${nestPairIndex + 1} ${content.mouse1.sex === "female" ? "Mother" : "Father"}`;
          }
        } else {
          content.mouse1 = nestPair.litters[inspectInfo.litterIndex].find(mouse => mouse.id === inspectInfo.organismId);
          inspectedName = `Pair ${nestPairIndex + 1} Litter ${inspectInfo.litterIndex + 1} Offspring`;
          content.isOffspring = true;
        }
      }
    } else if (inspectInfo && inspectInfo.type === "gamete") {
      content.mouse1 = undefined;
    }
    content.title = (inspectInfo.type !== "none" ? `Inspect: ${inspectedName}` : "Inspect");
    return content;
  }

  private setRightPanel = (panelType: RightPanelType) => {
    const { breeding } = this.stores;
    breeding.setRightPanel(panelType);
  }
}
