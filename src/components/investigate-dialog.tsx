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
      <div className="investigate-dialog">
        <div className="investigate-dialog-header">
          <div className="investigate-dialog-title">Investigate</div>
          <div className="investigate-dialog-close" onClick={this.handleClickClose}>x</div>
        </div>
        <div className="investigate-dialog-content">
          <div className="investigate-dialog-message">Select a [space] to begin your investigation</div>
          <div className="investigate-dialog-flex-container">
            <div className="investigate-dialog-button-holder" onClick={this.handleClickInvestigatePopulation}>
              <div className="investigate-dialog-button">Population</div>
              <div className="investigate-dialog-button-footer">Some descriptive text goes into this space</div>
            </div>
            <div className="investigate-dialog-button-holder">
              <div className="investigate-dialog-button">Breeding</div>
              <div className="investigate-dialog-button-footer">Some descriptive text goes into this space</div>
            </div>
            <div className="investigate-dialog-button-holder">
              <div className="investigate-dialog-button">Scope/Zoom</div>
              <div className="investigate-dialog-button-footer">Some descriptive text goes into this space</div>
            </div>
            <div className="investigate-dialog-button-holder">
              <div className="investigate-dialog-button">Protein/DNA</div>
              <div className="investigate-dialog-button-footer">Some descriptive text goes into this space</div>
            </div>
            <div className="investigate-dialog-button-holder">
              <div className="investigate-dialog-button">Comparison</div>
              <div className="investigate-dialog-button-footer">Some descriptive text goes into this space</div>
            </div>
          </div>
        </div>
        <div className="investigate-dialog-footer"/>
      </div>
    );
  }

  private handleClickClose = () => {
    const {ui} = this.stores;
    { ui.setShowInvestigationModalSelect(!ui.showInvestigationModalSelect); }
  }

  private handleClickInvestigatePopulation = () => {
    const {ui} = this.stores;
    { ui.setShowInvestigationPanel(true); }
    { ui.setShowInvestigationModalSelect(false); }
  }

}
