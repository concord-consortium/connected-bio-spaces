import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./legend.sass";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class LegendComponent extends BaseComponent<IProps, IState> {

  public render() {
    return (
      <div className="legend">
        <div className="grid-item item-top-left">
          <div className="key-circle female-color" />
          <div>Female</div>
        </div>
        <div className="grid-item item-top-right">
          <div className="key-circle male-color" />
          <div>Male</div>
        </div>
        <div className="grid-item item-bottom">
          <div className="key-circle heterozygote-color" />
          <div>Heterozygote</div>
        </div>
      </div>
    );
  }
}
