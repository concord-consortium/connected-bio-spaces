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

        <div className="left-nav-header left-nav-header-investigate">
        Investigate
        </div>

        <div className="left-nav-button-holder left-nav-button-holder-investigate">
          <div className="left-nav-button left-nav-button-square"
            onClick={this.handleClickInvestigate}>
            select
          </div>
        </div>

        <div className="left-nav-header left-nav-header-collect">
        Collect
        </div>
        <div className="left-nav-button-holder left-nav-button-holder-collect">
          <div className="left-nav-button left-nav-button-circle">+</div>
          <div className="left-nav-button left-nav-button-circle">+</div>
          <div className="left-nav-button left-nav-button-circle">+</div>
          <div className="left-nav-button left-nav-button-circle">+</div>
          <div className="left-nav-button left-nav-button-circle">+</div>
          <div className="left-nav-button left-nav-button-circle">+</div>
        </div>
      </div>
    );
  }

  private handleClickInvestigate = () => {
    const {ui} = this.stores;
    { ui.setShowInvestigationModalSelect(!ui.showInvestigationModalSelect); }
  }
}
