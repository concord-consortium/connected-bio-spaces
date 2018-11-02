import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./investigation-panel.sass";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class InvestigationPanelComponent extends BaseComponent<IProps, IState> {

  public render() {
    return (
      <div className="investigation-panel">
        <div className="investigation-panel-header">
          <div className="investigation-panel-title">Investigate: Population</div>
          <div className="investigation-panel-close" onClick={this.handleClickClose}>x</div>
        </div>
        <div className="investigation-panel-content">
          <iframe src="https://connected-bio.concord.org/branch/populations-model/"
                  height="650" width="1120" scrolling="no" frameborder="0">
            <p>Your browser does not support iframes.</p>
          </iframe>
        </div>
        <div className="investigation-panel-footer"/>
      </div>
    );
  }

  private handleClickClose = () => {
    const {ui} = this.stores;
    { ui.setShowInvestigationPanel(!ui.setShowInvestigationPanel); }
  }

}
