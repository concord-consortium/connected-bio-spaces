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
        <div className="container">
          <div className="icon-holder">
            <img src="assets/connected-bio-logo.png" className="icon" data-test="top-bar-img" />
          </div>
          <div className="title-holder" data-test="top-bar-title">
            Deer Mice
          </div>
        </div>
      </div>
    );
  }
}
