import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./zoom-control.sass";

interface IProps extends IBaseProps {
}
interface IState {}

@inject("stores")
@observer
export class ZoomControl extends BaseComponent<IProps, IState> {

  public render() {
    return (
      <div className="zoom-control-container" data-test="zoom-control-container">
        <div className="zoom-control zoom-out">-</div>
        <div className="zoom-control zoom-in">+</div>
      </div>
    );
  }
}
