import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./investigate-dialog.sass";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class InvestigateDialogComponent extends BaseComponent<IProps, IState> {

  public render() {
    return (
      <div className="investigate-dialog" data-test="investigate-dialogue">
        <div className="header">
          <div className="title" data-test="investigate-dialog-title">Investigate</div>
          <div className="close" onClick={this.handleClickClose}>x</div>
        </div>
        <div className="content">
          <div className="message" data-test="investigate-dialog-message">
            Select a [space] to begin your investigation
          </div>
          <div className="flex-container" data-test="investigate-options">
            <div className="button-holder" onClick={this.handleClickInvestigatePopulation}>
              <div className="button" data-test="investigate-option-population">Population</div>
              <div className="button-footer">Some descriptive text goes into this space</div>
            </div>
            <div className="button-holder">
              <div className="button" data-test="investigate-option-breeding">Breeding</div>
              <div className="button-footer">Some descriptive text goes into this space</div>
            </div>
            <div className="button-holder">
              <div className="button" data-test="investigate-option-scope-zoom">Scope/Zoom</div>
              <div className="button-footer">Some descriptive text goes into this space</div>
            </div>
            <div className="button-holder">
              <div className="button" data-test="investigate-option-protein">Protein/DNA</div>
              <div className="button-footer">Some descriptive text goes into this space</div>
            </div>
            <div className="button-holder">
              <div className="button" data-test="investigate-option-comparison">Comparison</div>
              <div className="button-footer">Some descriptive text goes into this space</div>
            </div>
          </div>
        </div>
        <div className="footer"/>
      </div>
    );
  }

  private handleClickClose = () => {
    const {ui} = this.stores;
    ui.setShowInvestigationModalSelect(!ui.showInvestigationModalSelect);
  }

  private handleClickInvestigatePopulation = () => {
    const {ui} = this.stores;
    ui.setShowInvestigationPanel(true);
    ui.setShowInvestigationModalSelect(false);
  }

}
