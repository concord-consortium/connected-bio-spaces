import { inject, observer } from "mobx-react";
import * as React from "react";

import { BaseComponent, IBaseProps } from "../../base";

import "./manipulation-controls.sass";

interface IProps extends IBaseProps {
  rowIndex: number;
}
interface IState {}

@inject("stores")
@observer
export class ManipulationControls extends BaseComponent<IProps, IState> {

  public render() {
    const row = this.getControlsRow();

    const disabledClass = row.zoomLevel === "organism" ? " disabled" : "";
    const activeClass = row.mode === "assay" ? " active" : "";
    const assayClass = "assay" + disabledClass + activeClass;
    return (
      <div className="manipulation-controls" data-test="manipulations-panel">
        <div className={assayClass} onClick={this.handleAssayClick}>Assay</div>
      </div>
    );
  }

  private getControlsRow = () => {
    const { organisms } = this.stores;
    const { rowIndex } = this.props;
    return organisms.rows[rowIndex];
  }

  private handleAssayClick = () => {
    const row = this.getControlsRow();

    if (row.mode === "normal") {
      row.setMode("assay");
    } else {
      row.setMode("normal");
    }
  }
}
