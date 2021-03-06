import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./zoom-control.sass";
import { ZoomLevelType } from "../models/spaces/organisms/organisms-row";
import { OrganismsSpaceModelType } from "../models/spaces/organisms/organisms-space";

interface IProps extends IBaseProps {
  handleZoom: (zoomLevel: number) => void;
  rowIndex: number;
  showTargetZoom: boolean;
  disable: boolean;
}
interface IState {}

@inject("stores")
@observer
export class ZoomControl extends BaseComponent<IProps, IState> {

  public render() {
    const { showTargetZoom } = this.props;
    const { organisms } = this.stores;
    if (!organisms) return null;

    const row = this.getControlsRow();
    const targetClass = showTargetZoom ? " target sticky" : "";
    const activeClass = row.mode === "target-zoom" ? " active" : "";

    const zoomInClass = "zoom-in" + this.getZoomClass(["organism", "cell"], organisms) + targetClass + activeClass;
    const zoomOutClass = "zoom-out" + this.getZoomClass(["cell", "receptor", "nucleus"], organisms);
    const zoomInIcon = "#icon-zoomin" + (showTargetZoom ? "-target" : "");
    return (
      <div className="zoom-container" data-test="zoom-container">
        <div className="zoom-control-container" data-test="zoom-control-container">
          <button className={"organism-button " + zoomOutClass}
                  onClick={this.handleZoomOutButton}
                  data-test="zoom-out">
            <svg className="icon">
              <use xlinkHref="#icon-zoomout" />
            </svg>
          </button>
          <button className={"organism-button " + zoomInClass}
                  onClick={this.handleZoomInButton}
                  data-test="zoom-in">
            <svg className="icon">
              <use xlinkHref={zoomInIcon} />
            </svg>
          </button>
        </div>
        <div className="label">Zoom</div>
      </div>
    );
  }

  private getZoomClass = (enabledZooms: ZoomLevelType[], organisms: OrganismsSpaceModelType) => {
    const { rowIndex, disable } = this.props;
    const row = organisms.rows[rowIndex];
    if (disable || row.zoomLevel === "cell" && !organisms.showZoomToNucleus && !organisms.showZoomToReceptor) {
      return " disabled";
    }
    const disabledClass = !row.organismsMouse || enabledZooms.indexOf(row.zoomLevel) === -1 ? " disabled" : "";
    return disabledClass;
  }

  private handleZoomInButton = () => {
    if (this.props.showTargetZoom) {
      const row = this.getControlsRow();
      if (row.mode === "target-zoom") {
        row.setMode("normal");
      } else {
        row.setMode("target-zoom");
      }
    } else {
      if (this.props.handleZoom) {
        this.props.handleZoom(1);
      }
    }
  }

  private handleZoomOutButton = () => {
    if (this.props.handleZoom) {
      this.props.handleZoom(-1);
    }
  }

  private getControlsRow = () => {
    const { organisms } = this.stores;
    const { rowIndex } = this.props;
    return organisms!.rows[rowIndex];
  }
}
