import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./collect-button.sass";

interface IProps extends IBaseProps {
  isCollected: boolean;
  isBrown: boolean;
  isMale: boolean;
  isHeterozygote: boolean;
  subTitle: string;
  index: number;
}
interface IState {}

@inject("stores")
@observer
export class CollectButtonComponent extends BaseComponent<IProps, IState> {

  public render() {
    let hasClose: boolean = false;
    let buttonClass: string = "collect-button uncollected";
    const innerOutlineClass: string = this.props.isHeterozygote ? "inner-outline heterozygote" : "inner-outline";
    let iconPath: string = "assets/mouse_collect.png";
    if (this.props.isCollected) {
      buttonClass = this.props.isMale ? "collect-button male" : "collect-button female";
      iconPath = this.props.isBrown ? "assets/mouse_field.png" : "assets/mouse_beach.png";
      hasClose = true;
    }
    return (
      <div className="collect-button-holder">
        <div className={buttonClass} onClick={this.handleClickButton}>
          <div className={innerOutlineClass}>
            <img src={iconPath} className="icon"/>
            <div className="label">{this.props.subTitle}</div>
          </div>
        </div>
        {hasClose ? <div className="x-close" onClick={this.handleClickClose}>x</div> : null}
        <div className="index">{this.props.index + 1}</div>
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
