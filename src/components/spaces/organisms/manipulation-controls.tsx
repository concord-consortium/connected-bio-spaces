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

    const assayDisabledClass = row.zoomLevel === "organism" ? " disabled" : "";
    const assayActiveClass = row.mode === "assay" ? " active" : "";
    const assayClass = "assay" + assayDisabledClass + assayActiveClass;

    const inspectDisabledClass = row.zoomLevel === "protein" ? " " : " disabled";
    const inspectActiveClass = row.mode === "inspect" ? " active" : "";
    const inspectClass = "assay" + inspectDisabledClass + inspectActiveClass;
    return (
      <div className="manipulation-controls" data-test="manipulations-panel">
        <div className={assayClass} onClick={this.handleAssayClick}>Assay</div>
        <div className={inspectClass} onClick={this.handleInspectClick}>Inspect</div>
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

  private handleInspectClick = () => {
    const row = this.getControlsRow();

    if (row.mode === "normal") {
      row.setMode("inspect");
    } else {
      row.setMode("normal");
    }
  }
}
