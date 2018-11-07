import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./main-content.sass";
import { InvestigateDialogComponent } from "./investigate-dialog";
import { InvestigationPanelComponent } from "./investigation-panel";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class MainContentComponent extends BaseComponent<IProps, IState> {

  public render() {
    return (
      <div className="main-content">
        {this.renderDialog()}
      </div>
    );
  }

  private renderDialog() {
    const {ui} = this.stores;
    const {showInvestigationModalSelect} = this.stores.ui;
    const {showInvestigationPanel} = this.stores.ui;
    if (showInvestigationModalSelect) {
      return <InvestigateDialogComponent/>;
    } else if (showInvestigationPanel) {
      return <InvestigationPanelComponent/>;
    }
  }
}
