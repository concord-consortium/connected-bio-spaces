import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./collect-button.sass";
import { Mouse, MouseType, UNCOLLECTED_IMAGE } from "../models/mouse";

interface IProps extends IBaseProps {
  backpackIndex?: number;
  clickMouse?: () => void;
  clickEmpty?: () => void;
  clickClose?: () => void;
}
interface IState {}

@inject("stores")
@observer
export class CollectButtonComponent extends BaseComponent<IProps, IState> {

  public render() {
    const { backpack } = this.stores;
    const { backpackIndex } = this.props;
    const mouse = backpack.getMouseAtIndex(backpackIndex);
    return (
      <div className="collect-button-holder">
        {mouse ? this.renderFull(mouse) : this.renderEmpty()}
      </div>
    );
  }
  private renderFull(mouse: MouseType) {
    const { backpackIndex, clickMouse, clickClose } = this.props;
    const handleMouse = clickMouse ? clickMouse : this.handleClickMouse;
    const handleClose = clickClose ? clickClose : this.handleClickRemove;
    let buttonClass = mouse.sex === "male" ? "collect-button male" : "collect-button female";
    buttonClass += this.isDeselected() ? " deselected" : "";
    const innerOutlineClass: string = mouse.isHeterozygote ? "inner-outline heterozygote" : "inner-outline";
    return (
      <div>
        <div className="collect-button-outline">
          <div className={buttonClass} onClick={handleMouse}>
            <div className={innerOutlineClass}>
              <img src={mouse.baseImage} className="icon"/>
              <div className="label">{mouse.label}</div>
            </div>
          </div>
        </div>
        <div className="x-close" onClick={handleClose}>x</div>
        <div className="index">{backpackIndex != null ? backpackIndex + 1 : ""}</div>
      </div>
    );
  }
  private renderEmpty() {
    const { backpackIndex, clickEmpty } = this.props;
    const handleClick = clickEmpty ? clickEmpty : this.handleClickButton;
    return (
      <div>
        <div className="collect-button-outline uncollected">
          <div className={"collect-button uncollected"} onClick={handleClick}>
            <div className={"inner-outline"}>
              <img src={UNCOLLECTED_IMAGE} className="icon"/>
            </div>
          </div>
        </div>
        <div className="index uncollected">{backpackIndex != null ? backpackIndex + 1 : ""}</div>
      </div>
    );
  }
  private handleClickButton = () => {
   this.addTestMouseToBackpack();
  }
  private addTestMouseToBackpack = () => {
    const {backpack} = this.stores;
    const {backpackIndex} = this.props;
    if (backpack.getMouseAtIndex(backpackIndex)) {
      return;
    }

    const randSex = Math.random() > .5 ? "male" : "female";
    const randGenotype = Math.random() > .5 ? (Math.random() > .5 ? "BB" : "Bb") :
                                                  (Math.random() > .5 ? "bB" : "bb");
    backpack.addCollectedMouse(Mouse.create({sex: randSex, genotype: randGenotype, label: randGenotype}));
  }
  private handleClickRemove = () => {
    const {backpack} = this.stores;
    const {backpackIndex} = this.props;
    if (backpackIndex != null) {
      backpack.removeCollectedMouse(backpackIndex);
    }
  }

  private handleClickMouse = () => {
    const { backpack } = this.stores;
    const { backpackIndex } = this.props;
    if (backpack.activeSlot === backpackIndex) {
      backpack.deselectSlot();
    } else {
      backpack.selectSlot(backpackIndex);
    }
  }
  private isDeselected = () => {
    const { backpack } = this.stores;
    const { backpackIndex } = this.props;
    return backpack.activeSlot != null && backpack.activeSlot !== backpackIndex;
  }
}
