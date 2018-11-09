import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./left-nav-panel.sass";

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
        <div className="button-holder collect" data-test="backpack-items">
          <div className="button circle">+</div>
          <div className="button circle">+</div>
          <div className="button circle">+</div>
          <div className="button circle">+</div>
          <div className="button circle">+</div>
          <div className="button circle">+</div>
        </div>
      </div>
    );
  }

  private handleClickInvestigate = () => {
    const {ui} = this.stores;
    { ui.setShowInvestigationModalSelect(!ui.showInvestigationModalSelect); }
  }
}
