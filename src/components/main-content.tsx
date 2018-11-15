import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./main-content.sass";
import { InvestigateDialogComponent } from "./investigate-dialog";
import { PopulationsSpaceComponent } from "./spaces/populations-space";
import { CellZoomSpaceComponent } from "./spaces/cell-zoom-space";

interface IProps extends IBaseProps {}
interface IState {}

const SpaceComponents: any = {
  populations: PopulationsSpaceComponent,
  cellZoom: CellZoomSpaceComponent
};

@inject("stores")
@observer
export class MainContentComponent extends BaseComponent<IProps, IState> {

  public render() {
    return (
      <div className="main-content" data-test="main-content">
        {this.renderMainContent()}
      </div>
    );
  }

  private renderMainContent() {
    const {showInvestigationModalSelect, investigationPanelSpace} = this.stores.ui;
    const {showInvestigationPanel} = this.stores.ui;

    // stawman code
    const SpaceComponent = SpaceComponents[investigationPanelSpace];

    if (showInvestigationModalSelect) {
      return <InvestigateDialogComponent/>;
    } else if (showInvestigationPanel) {
      return <SpaceComponent/>;
    }
  }
}
