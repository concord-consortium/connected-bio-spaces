import { inject, observer } from "mobx-react";
import * as React from "react";
import { units } from "../models/units";
import { BaseComponent, IBaseProps } from "./base";

import "./top-bar.sass";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class TopBarComponent extends BaseComponent<IProps, IState> {

  public render() {
    const title = units[this.stores.unit].title;

    return (
      <div className="top-bar">
        <div className="container">
          <div className="icon-holder">
            <svg className="icon" data-test="top-bar-img">
              <use xlinkHref="#icon-logo" />
            </svg>
          </div>
          <div className="title-holder" data-test="top-bar-title">
            { title }
          </div>
        </div>
      </div>
    );
  }
}
