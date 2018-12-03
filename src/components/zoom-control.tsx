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
        <div className="zoom-control zoom-out" onClick={this.handleZoomOutButton}>-</div>
        <div className="zoom-control zoom-in" onClick={this.handleZoomInButton}>+</div>
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
