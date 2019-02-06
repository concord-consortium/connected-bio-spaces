import { inject, observer } from "mobx-react";
import * as React from "react";

import { BaseComponent, IBaseProps } from "../../base";

import "./manipulation-controls.sass";
import { ModeType, ZoomLevelType } from "../../../models/spaces/organisms/organisms-row";

interface IProps extends IBaseProps {
  rowIndex: number;
}
interface IState {}

@inject("stores")
@observer
export class ManipulationControls extends BaseComponent<IProps, IState> {

  public render() {
    const {organisms} = this.stores;
    const row = this.getControlsRow();
    return (
      <div className="manipulation-controls" data-test="manipulations-panel">
        <button className={"organism-button sticky " + this.getButtonClass("assay", ["cell", "protein"])}
                onClick={this.handleAssayClick} data-test="measure">
          <svg className={"icon " + this.getButtonClass("assay", ["cell", "protein"])}>
            <use xlinkHref="#icon-measure" />
          </svg>
          <div className="label">Measure</div>
        </button>
        <button className={"organism-button sticky " + this.getButtonClass("inspect", ["protein"])}
                onClick={this.handleInspectClick} data-test="inspect">
          <svg className={"icon " + this.getButtonClass("inspect", ["protein"])}>
            <use xlinkHref="#icon-show-information" />
          </svg>
          <div className="label">Inspect</div>
        </button>
        <button className={"organism-button add sticky " + this.getButtonClass("add", ["cell", "protein"])}
                onClick={this.handleAddSubstanceClick} data-test="add-substance">
          <svg className={"icon " + this.getButtonClass("add", ["cell", "protein"])}>
            <use xlinkHref="#icon-add-substance" />
          </svg>
          <div className="label">Add Substance</div>
        </button>
        <select className={"organism-button select " + this.getButtonClass("add", ["cell", "protein"])}
                value={row.selectedSubstance} onChange={this.handleSubstanceChange}>
          <option value={"hormone"}>{organisms.getSubstanceLabel("hormone")}</option>
          <option value={"pheomelanin"}>{organisms.getSubstanceLabel("pheomelanin")}</option>
          <option value={"eumelanin"}>{organisms.getSubstanceLabel("eumelanin")}</option>
          <option value={"signalProtein"}>{organisms.getSubstanceLabel("signalProtein")}</option>
        </select>
      </div>
    );
  }

  private getButtonClass(buttonMode: ModeType, enabledZooms: ZoomLevelType[]) {
    const row = this.getControlsRow();
    const disabledClass = enabledZooms.indexOf(row.zoomLevel) === -1 ? " disabled" : "";
    const activeClass = row.mode === buttonMode ? " active" : "";

    return disabledClass + activeClass;
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
