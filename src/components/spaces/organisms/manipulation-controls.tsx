import { inject, observer } from "mobx-react";
import * as React from "react";

import { BaseComponent, IBaseProps } from "../../base";

import "./manipulation-controls.sass";
import { ModeType } from "../../../models/spaces/organisms/organisms-row";

interface IProps extends IBaseProps {
  rowIndex: number;
}
interface IState {}

@inject("stores")
@observer
export class ManipulationControls extends BaseComponent<IProps, IState> {

  public render() {
    const row = this.getControlsRow();
    const inspectDisabledClass = row.zoomLevel === "protein" ? " " : " disabled";
    const inspectActiveClass = row.mode === "inspect" ? " active" : "";
    const inspectClass = "button" + inspectDisabledClass + inspectActiveClass;

    return (
      <div className="manipulation-controls" data-test="manipulations-panel">
        <div className={this.getButtonClass("assay")} onClick={this.handleAssayClick}>Measure</div>
        |
        <div className={inspectClass} onClick={this.handleInspectClick}>Inspect</div>
        |
        <div className={this.getButtonClass("add")} onClick={this.handleAddSubstanceClick}>Add Substance</div>
        <select value={row.selectedSubstance} onChange={this.handleSubstanceChange}>
            <option value={"hormone"}>Hormone</option>
            <option value={"pheomelanin"}>Pheomelanin</option>
            <option value={"eumelanin"}>Eumelanin</option>
            <option value={"signalProtein"}>Signal Protein</option>
          </select>
      </div>
    );
  }

  private getButtonClass(buttonMode: ModeType) {
    const row = this.getControlsRow();
    const disabledClass = row.zoomLevel === "organism" ? " disabled" : "";
    const activeClass = row.mode === buttonMode ? " active" : "";

    return "button" + disabledClass + activeClass;
  }

  private getControlsRow = () => {
    const { organisms } = this.stores;
    const { rowIndex } = this.props;
    return organisms.rows[rowIndex];
  }

  private handleAssayClick = () => {
    const row = this.getControlsRow();

    if (row.mode === "assay") {
      row.setMode("normal");
    } else {
      row.setMode("assay");
    }
  }

  private handleAddSubstanceClick = () => {
    const row = this.getControlsRow();

    if (row.mode === "add") {
      row.setMode("normal");
    } else {
      row.setMode("add");
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

  private handleSubstanceChange = (e: React.ChangeEvent) => {
    const row = this.getControlsRow();
    row.setSelectedSubstance((e.currentTarget as HTMLSelectElement).value);
  }
}
