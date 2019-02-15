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
    const hormoneClass = "hormone " + (row.selectedSubstance === "hormone" ? "active" : "");
    const signalProteinClass = "signal-protein " + (row.selectedSubstance === "signalProtein" ? "active" : "");
    const pheomelaninClass = "pheomelanin " + (row.selectedSubstance === "pheomelanin" ? "active" : "");
    const eumelaninClass = "eumelanin " + (row.selectedSubstance === "eumelanin" ? "active" : "");
    const addDisabledClass = this.getButtonDisabledClass("add", ["cell", "protein"]);
    return (
      <div className="manipulation-controls" data-test="manipulations-panel">
        <button className={"organism-button sticky " + this.getButtonClass("assay", ["cell", "protein"])}
                onClick={this.handleAssayClick} data-test="measure">
          <svg className={"icon " + this.getButtonClass("assay", ["cell", "protein"])}>
            <use xlinkHref="#icon-measure" />
          </svg>
          <div className="label">Measure</div>
        </button>
        <button className={"organism-button add sticky " + this.getButtonClass("add", ["cell", "protein"])}
                onClick={this.handleAddSubstanceClick} data-test="add-substance">
          <svg className={"icon " + this.getButtonClass("add", ["cell", "protein"])}>
            <use xlinkHref="#icon-add-substance" />
          </svg>
          <div className="label">Add</div>
        </button>
        <div className={"substance-type-container" + this.getButtonClass("add", ["cell", "protein"])}>
          <div className="button-row top">
            <div className={"radio-button " + hormoneClass} onClick={this.handleSubstanceChange("hormone")}>
              <div className="radio-outer-circle">
                <div className={"radio-circle " + hormoneClass + " " + addDisabledClass} />
              </div>
              <div className={"label " + addDisabledClass}>{organisms.getSubstanceLabel("hormone")}</div>
            </div>
            <div className={"radio-button " + signalProteinClass} onClick={this.handleSubstanceChange("signalProtein")}>
              <div className="radio-outer-circle">
                <div className={"radio-circle " + signalProteinClass + " " + addDisabledClass} />
              </div>
              <div className={"label " + addDisabledClass}>{organisms.getSubstanceLabel("signalProtein")}</div>
            </div>
          </div>
          <div className="button-row bottom">
            <div className={"radio-button " + pheomelaninClass} onClick={this.handleSubstanceChange("pheomelanin")}>
              <div className="radio-outer-circle">
                <div className={"radio-circle " + pheomelaninClass + " " + addDisabledClass} />
              </div>
              <div className={"label " + addDisabledClass}>{organisms.getSubstanceLabel("pheomelanin")}</div>
            </div>
            <div className={"radio-button " + eumelaninClass} onClick={this.handleSubstanceChange("eumelanin")}>
              <div className="radio-outer-circle">
                <div className={"radio-circle " + eumelaninClass + " " + addDisabledClass} />
              </div>
              <div className={"label " + addDisabledClass}>{organisms.getSubstanceLabel("eumelanin")}</div>
            </div>
          </div>
        </div>
        <button className={"organism-button sticky " + this.getButtonClass("inspect", ["protein"])}
                onClick={this.handleInspectClick} data-test="inspect">
          <svg className={"icon " + this.getButtonClass("inspect", ["protein"])}>
            <use xlinkHref="#icon-inspect-protein" />
          </svg>
          <div className="label">Inspect</div>
        </button>
      </div>
    );
  }

  private getButtonClass(buttonMode: ModeType, enabledZooms: ZoomLevelType[]) {
    const row = this.getControlsRow();
    const disabledClass = enabledZooms.indexOf(row.zoomLevel) === -1 ? " disabled" : "";
    const activeClass = row.mode === buttonMode ? " active" : "";

    return disabledClass + activeClass;
  }

  private getButtonDisabledClass(buttonMode: ModeType, enabledZooms: ZoomLevelType[]) {
    const row = this.getControlsRow();
    const disabledClass = enabledZooms.indexOf(row.zoomLevel) === -1 ? " disabled" : "";
    return disabledClass;
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

    if (row.mode === "inspect") {
      row.setMode("normal");
    } else {
      row.setMode("inspect");
    }
  }

  private handleSubstanceChange = (substance: string) => () => {
    const row = this.getControlsRow();
    row.setSelectedSubstance(substance);
  }
}
