import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../base";
import { TwoUpDisplayComponent } from "../two-up-display";
import { InstructionsComponent } from "../instructions";
import { RightPanelType } from "../../models/ui";
import { BreedingContainer } from "./breeding/breeding-container";
import { BreedingData } from "./breeding/breeding-data";
import { InspectPanel } from "../inspect-panel";
import { units } from "../../models/units";

interface InspectContent {
  title: string;
  mouse1: any;
  mouse2: any;
  label: string;
  pairMeta?: string;
  isOffspring: boolean;
  isGamete: boolean;
}

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class BreedingSpaceComponent extends BaseComponent<IProps, IState> {

  public render() {
    const { breeding } = this.stores;
    const { rightPanel, showParentGenotype, showOffspringGenotype } = breeding;
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
          const showGenotype = content.isOffspring ? showOffspringGenotype : showParentGenotype;
          return <InspectPanel
                  mouse1={content.mouse1}
                  mouse2={content.mouse2}
                  pairLabel={content.label}
                  pairMeta={content.pairMeta}
                  isOffspring={content.isOffspring}
                  isGamete={content.isGamete}
                  showGenotype={showGenotype}
                 />;
        default:
          return null;
      }
    })();

    const unitDef = units[this.stores.unit];
    const title = unitDef.breeding.title;

    return (
      <TwoUpDisplayComponent
        leftTitle={title}
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
    const { breeding, unit } = this.stores;
    const { inspectInfo, nestPairs } = breeding;
    const unitBreeding = units[unit].breeding;
    const content: InspectContent = { title: "",
                                    mouse1: undefined,
                                    mouse2: undefined,
                                    label: "",
                                    pairMeta: undefined,
                                    isOffspring: false,
                                    isGamete: false,
                                  };
    let inspectedName = unitBreeding.inspectPairsPaneTitle;
    if (inspectInfo && inspectInfo.type === "nest") {
      const pairId = inspectInfo.nestPairId;
      const nestPair = nestPairs.find(pair => pair.id === pairId);
      content.mouse1 = nestPair && nestPair.leftMouse;
      content.mouse2 = nestPair && nestPair.rightMouse;
      content.label = nestPair ? nestPair.label : "";
      content.pairMeta = nestPair && nestPair.meta ? nestPair.meta : undefined;
    } else if (inspectInfo && (inspectInfo.type === "organism" || inspectInfo.type === "gamete")) {
      const isGamete = inspectInfo.type === "gamete";
      const pairId = inspectInfo.nestPairId;
      const nestPairIndex = nestPairs.findIndex(pair => pair.id === pairId);
      const nestPair = nestPairs[nestPairIndex];
      if (nestPair) {
        if (inspectInfo.isParent) {
          if (nestPair.leftMouse.id === inspectInfo.organismId) {
            content.mouse1 = nestPair.leftMouse;
          } else if (nestPair.rightMouse.id === inspectInfo.organismId) {
            content.mouse1 = nestPair.rightMouse;
          }
          if (unitBreeding.inspectParentPaneTitle) {
            inspectedName = unitBreeding.inspectParentPaneTitle;
            if (isGamete) inspectedName += " Gametes";
          } else {
            inspectedName = isGamete
            ? `${content.mouse1.sex === "female" ? "Mother" : "Father"} Gametes`
            : `${nestPair.chartLabel} ${content.mouse1.sex === "female" ? "Mother" : "Father"}`;
          }
        } else {
          content.mouse1 = nestPair.litters[inspectInfo.litterIndex].find(mouse => mouse.id === inspectInfo.organismId);
          if (unitBreeding.inspectOffspringPaneTitle) {
            inspectedName = unitBreeding.inspectOffspringPaneTitle;
            if (isGamete) inspectedName += " Gametes";
          } else {
            inspectedName = isGamete
            ? "Offspring Gametes"
            : `${nestPair.chartLabel} Litter ${inspectInfo.litterIndex + 1} Offspring`;
          }
          content.isOffspring = true;
        }
        content.isGamete = isGamete;
      }
    }
    content.title = (inspectInfo.type !== "none" ? `Inspect: ${inspectedName}` : "Inspect");
    return content;
  }

  private setRightPanel = (panelType: RightPanelType) => {
    const { breeding } = this.stores;
    breeding.setRightPanel(panelType);
  }
}
