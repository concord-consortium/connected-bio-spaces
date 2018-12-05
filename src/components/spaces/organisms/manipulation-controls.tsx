import { inject, observer } from "mobx-react";
import * as React from "react";

import { BaseComponent, IBaseProps } from "../../base";

import "./manipulation-controls.sass";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class ManipulationControls extends BaseComponent<IProps, IState> {

  public render() {
    return (
      <div className="manipulation-controls" data-test="manipulations-panel">
        <div className="assay" onClick={this.handleAssayClick}>Assay</div>
      </div>
    );
  }

  private handleAssayClick = () => {
    // begin assay
  }
}
