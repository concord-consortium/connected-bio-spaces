import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./left-nav-panel.sass";
import { CollectButtonComponent } from "./collect-button";
import { LegendComponent } from "./legend";
import { Mouse } from "../models/mouse";

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
    backpack.addCollectedMouse(Mouse.create({sex: "male", genotype: "BB", label: "lbl"}));
    backpack.addCollectedMouse(Mouse.create({sex: "male", genotype: "Bb", label: "lbl"}));
    backpack.addCollectedMouse(Mouse.create({sex: "female", genotype: "bB", label: "lbl"}));
    backpack.addCollectedMouse(Mouse.create({sex: "female", genotype: "bb", label: "lbl"}));
  }

  private renderCollectButtons = () => {
    this.addTestMiceToBackpack();
    const {backpack} = this.stores;
    const {ui} = this.stores;
    const collectedSlots = backpack.collectedMice.length;
    const emptySlots = ui.availableBackpackSlots - collectedSlots;
    const buttons = backpack.collectedMice.map((slot, index) => {
                      return <CollectButtonComponent
                               mouse={slot}
                               subTitle={"tbd"}
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
        mouse={undefined}
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
