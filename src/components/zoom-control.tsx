import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./zoom-control.sass";

interface IProps extends IBaseProps {
  handleZoom: any;
}
interface IState {}

@inject("stores")
@observer
export class ZoomControl extends BaseComponent<IProps, IState> {

  public render() {
    return (
      <div className="zoom-control-container" data-test="zoom-control-container">
        <button className="organism-button zoom-out" onClick={this.handleZoomOutButton} data-test="zoom-out">
          <svg className="icon">
            <use xlinkHref="#icon-zoomout" />
          </svg>
          <div className="label">Zoom Out</div>
        </button>
        <button className="organism-button zoom-in" onClick={this.handleZoomInButton} data-test="zoom-in">
          <svg className="icon">
            <use xlinkHref="#icon-zoomin" />
          </svg>
          <div className="label">Zoom In</div>
        </button>
      </div>
    );
  }

  private handleZoomInButton = () => {
    if (this.props.handleZoom) {
      this.props.handleZoom(1);
    }
  }
  private handleZoomOutButton = () => {
    if (this.props.handleZoom) {
      this.props.handleZoom(-1);
    }
   }
}
