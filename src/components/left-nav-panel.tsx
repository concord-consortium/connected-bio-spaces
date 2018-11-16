import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./left-nav-panel.sass";
import { CollectButtonComponent } from "./collect-button";
import { LegendComponent } from "./legend";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class LeftNavPanelComponent extends BaseComponent<IProps, IState> {

  public render() {
    return (
      <div className="left-nav-panel">
        <div className="header investigate" >
        Investigate
        </div>
        <div className="button-holder investigate">
          <div className="button square" data-test="investigate-select-button"
            onClick={this.handleClickInvestigate}>
            select
          </div>
        </div>
        <div className="header collect" data-test="backpack">
        Collect
        </div>
        {this.renderCollectButtons()}
        <div className="footer">
          <LegendComponent/>
        </div>
      </div>
    );
  }

  private addTestMiceToBackpack = () => {
    const {backpack} = this.stores;
    backpack.addCollectedMouse({isCollected: true, isBrown: true, isMale: true,
                    isHeterozygote: false, subTitle: "m"});
    backpack.addCollectedMouse({isCollected: true, isBrown: false, isMale: true,
                    isHeterozygote: false, subTitle: "m2"});
    backpack.addCollectedMouse({isCollected: true, isBrown: true, isMale: false,
                    isHeterozygote: false, subTitle: "f"});
    backpack.addCollectedMouse({isCollected: true, isBrown: false, isMale: false,
                    isHeterozygote: false, subTitle: "f2"});
    backpack.addCollectedMouse({isCollected: true, isBrown: true, isMale: true,
                    isHeterozygote: true, subTitle: "m"});
  }

  private renderCollectButtons = () => {
    this.addTestMiceToBackpack();
    const {backpack} = this.stores;
    const {ui} = this.stores;
    const collectedSlots = backpack.collectedMice.length;
    const emptySlots = ui.availableBackpackSlots - collectedSlots;
    console.log(emptySlots);
    const buttons = backpack.collectedMice.map((slot, index) => {
                      return <CollectButtonComponent
                               isCollected={slot.isCollected}
                               isBrown={slot.isBrown}
                               isMale={slot.isMale}
                               isHeterozygote={slot.isHeterozygote}
                               subTitle={slot.subTitle}
                               index={index}
                               key={index}
                             />;
                    });
    for (let sl = 0; sl < emptySlots; sl++) {
      buttons.push(this.renderEmptyCollectButton(collectedSlots + sl));
    }
    return (
      <div className="button-holder collect" data-test="backpack-items">
        {buttons}
      </div>
    );
  }

  private renderEmptyCollectButton = (index: number) => {
    return (
      <CollectButtonComponent
        isCollected={false}
        isBrown={false}
        isMale={false}
        isHeterozygote={false}
        subTitle={""}
        index={index}
        key={index}
      />
    );
  }

  private handleClickInvestigate = () => {
    const {ui} = this.stores;
    { ui.setShowInvestigationModalSelect(!ui.showInvestigationModalSelect); }
  }

}
