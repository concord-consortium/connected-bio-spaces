import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./collect-button.sass";
import { BackpackMouse, BackpackMouseType, UNCOLLECTED_IMAGE } from "../models/backpack-mouse";

interface IProps extends IBaseProps {
  backpackMouse?: BackpackMouseType;
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
    const { backpackMouse } = this.props;
    return (
      <div className="collect-button-holder">
        {backpackMouse ? this.renderFull(backpackMouse) : this.renderEmpty()}
      </div>
    );
  }
  private renderFull(mouse: BackpackMouseType) {
    const { backpack } = this.stores;
    const { backpackMouse, clickMouse, clickClose } = this.props;
    const backpackMouseIndex = backpack.getMouseIndex(backpackMouse);
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
        <div className="index">{backpackMouseIndex > -1 ? backpackMouseIndex + 1 : ""}</div>
      </div>
    );
  }
  private renderEmpty() {
    const { backpack } = this.stores;
    const { backpackMouse, clickEmpty } = this.props;
    const backpackMouseIndex = backpack.getMouseIndex(backpackMouse);
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
        <div className="index uncollected">{backpackMouseIndex > -1 ? backpackMouseIndex + 1 : ""}</div>
      </div>
    );
  }
  private handleClickButton = () => {
   this.addTestMouseToBackpack();
  }
  private addTestMouseToBackpack = () => {
    const {backpack} = this.stores;
    const {backpackMouse} = this.props;
    if (backpackMouse) {
      return;
    }

    const randSex = Math.random() > .5 ? "male" : "female";
    const randGenotype = Math.random() > .5 ? (Math.random() > .5 ? "BB" : "Bb") :
                                                  (Math.random() > .5 ? "bB" : "bb");
    backpack.addCollectedMouse(BackpackMouse.create({sex: randSex, genotype: randGenotype, label: randGenotype}));
  }
  private handleClickRemove = () => {
    const {backpack} = this.stores;
    const {backpackMouse} = this.props;
    const backpackIndex = backpack.getMouseIndex(backpackMouse);
    if (backpackIndex > -1) {
      backpack.removeCollectedMouse(backpackIndex);
    }
  }

  private handleClickMouse = () => {
    const { backpack } = this.stores;
    const { backpackMouse } = this.props;
    backpack.selectMouse(backpackMouse);
  }
  private isDeselected = () => {
    const { backpack } = this.stores;
    const { backpackMouse } = this.props;
    return backpack.isDeselected(backpackMouse);
  }
}
