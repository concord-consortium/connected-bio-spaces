import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./collect-button.sass";
import { MouseType, UNCOLLECTED_IMAGE } from "../models/mouse";

interface IProps extends IBaseProps {
  mouse?: MouseType;
  subTitle: string;
  index: number;
}
interface IState {}

@inject("stores")
@observer
export class CollectButtonComponent extends BaseComponent<IProps, IState> {

  public render() {
    const { mouse } = this.props;
    return (
      <div className="collect-button-holder">
        {mouse ? this.renderFull(mouse) : this.renderEmpty()}
        <div className="index">{this.props.index + 1}</div>
      </div>
    );
  }
  private renderFull(mouse: MouseType) {
    const buttonClass = mouse.sex === "male" ? "collect-button male" : "collect-button female";
    const innerOutlineClass: string = mouse.isHeterozygote ? "inner-outline heterozygote" : "inner-outline";
    return (
      <div>
        <div className={buttonClass} onClick={this.handleClickButton}>
          <div className={innerOutlineClass}>
            <img src={mouse.baseImage} className="icon"/>
            <div className="label">{this.props.subTitle}</div>
          </div>
        </div>
        <div className="x-close" onClick={this.handleClickClose}>x</div>
      </div>
    );
  }
  private renderEmpty() {
    return (
      <div>
        <div className={"collect-button uncollected"} onClick={this.handleClickButton}>
          <div className={"inner-outline"}>
            <img src={UNCOLLECTED_IMAGE} className="icon"/>
          </div>
        </div>
      </div>
    );
  }
  private handleClickButton = () => {
   alert("handleClickButton, button index=" + this.props.index);
  }
  private handleClickClose = () => {
    alert("handleClickClose, button index=" + this.props.index);
  }
}
