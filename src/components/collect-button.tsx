import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./collect-button.sass";
import { Mouse, MouseType, UNCOLLECTED_IMAGE } from "../models/mouse";

interface IProps extends IBaseProps {
  mouse?: MouseType;
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
        <div className={buttonClass}>
          <div className={innerOutlineClass}>
            <img src={mouse.baseImage} className="icon"/>
            <div className="label">{mouse.label}</div>
          </div>
        </div>
        <div className="x-close" onClick={this.handleClickRemove}>x</div>
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
   this.addTestMouseToBackpack();
  }
  private addTestMouseToBackpack = () => {
    const {backpack} = this.stores;
    const randSex = Math.random() > .5 ? "male" : "female";
    const randGenotype = Math.random() > .5 ? (Math.random() > .5 ? "BB" : "Bb") :
                                                  (Math.random() > .5 ? "bB" : "bb");
    backpack.addCollectedMouse(Mouse.create({sex: randSex, genotype: randGenotype, label: "lbl"}));
  }
  private handleClickRemove = () => {
    const {backpack} = this.stores;
    backpack.removeCollectedMouse(this.props.index);
  }
}