import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./four-up-display.sass";

export const PANEL_ASPECT_RATIO = 1.68;

interface IProps extends IBaseProps {
  topRow: JSX.Element;
  bottomRow: JSX.Element;
}
interface IState {}

@inject("stores")
@observer
export class FourUpDisplayComponent extends BaseComponent<IProps, IState> {

  public render() {
    return (
      <div className="four-up-display" data-test="four-up-display">
        <div className="four-up-row top-row" data-test="four-up-top">{this.props.topRow}</div>
        <div className="four-up-row bottom-row" data-test="four-up-bottom">{this.props.bottomRow}</div>
      </div>
    );
  }
}
