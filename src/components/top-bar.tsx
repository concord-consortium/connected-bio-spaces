import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./top-bar.sass";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class TopBarComponent extends BaseComponent<IProps, IState> {

  public render() {

    return (
      <div className="top-bar">
        <div className="top-bar-container">
          <div className="top-bar-icon-holder">
            <img src="../assets/connected-bio-logo.png" height="26"/>
          </div>
          <div className="top-bar-title-holder">
            Beach Mice
          </div>
        </div>
      </div>
    );
  }
}
