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

  private renderCollectButtons = () => {
    const slots = [{isCollected: true, isBrown: true, isMale: true,
                    isHeterozygote: false, subTitle: "m"},
                   {isCollected: true, isBrown: false, isMale: true,
                    isHeterozygote: false, subTitle: "m2"},
                   {isCollected: true, isBrown: true, isMale: false,
                    isHeterozygote: false, subTitle: "f"},
                   {isCollected: true, isBrown: false, isMale: false,
                    isHeterozygote: false, subTitle: "f2"},
                   {isCollected: true, isBrown: true, isMale: true,
                    isHeterozygote: true, subTitle: "m"},
                   {isCollected: false, isBrown: false, isMale: false,
                    isHeterozygote: false, subTitle: ""}];
    const buttons = slots.map((slot, index) => {
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
    return (
      <div className="button-holder collect" data-test="backpack-items">
        {buttons}
      </div>
    );
  }

  private handleClickInvestigate = () => {
    const {ui} = this.stores;
    { ui.setShowInvestigationModalSelect(!ui.showInvestigationModalSelect); }
  }

}
