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
  index?: number;
}
interface IState {}

@inject("stores")
@observer
export class CollectButtonComponent extends BaseComponent<IProps, IState> {

  public render() {
    const { backpack } = this.stores;
    const { backpackMouse } = this.props;
    let className = "collect-button-holder";
    if (!backpackMouse) className += " uncollected";
    return (
      <div className={className}>
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
    buttonClass += this.isSelected() ? " selected" : "";
    const innerOutlineClass: string = mouse.isHeterozygote ? "inner-outline heterozygote" : "inner-outline";
    return (
      <div>
        <div className="x-close" onClick={handleClose} data-test="x-close-backpack">
          <svg className="icon">
            <use xlinkHref="#icon-close" />
          </svg>
        </div>
        <div className="collect-button-outline">
          <div className={buttonClass} onClick={handleMouse} data-test="stored-mouse-class">
            <div className={innerOutlineClass} data-test="inner-outline">
              <img src={mouse.baseImage} className="icon" data-test="stored-mouse-image"/>
              <div className="label" data-test="stored-mouse-label">{mouse.label}</div>
            </div>
          </div>
        </div>
        <div className="index" data-test="stored-mouse-index">
          {backpackMouseIndex > -1 ? backpackMouseIndex + 1 : ""}
        </div>
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
          <div className={"collect-button uncollected"} onClick={handleClick} data-test="empty-button">
            <div className={"inner-outline"}>
              <img src={UNCOLLECTED_IMAGE} className="icon"/>
            </div>
          </div>
        </div>
        <div className="index uncollected">{this.props.index}</div>
      </div>
    );
  }
  private handleClickButton = () => {
    // do nothing by default
  }
  private addTestMouseToBackpack = () => {
    const {backpack} = this.stores;
    const {backpackMouse} = this.props;
    if (backpackMouse) {
      return;
    }

    const randSex = Math.random() > .5 ? "male" : "female";
    const randGenotype = Math.random() > .5 ? (Math.random() > .5 ? "RR" : "RC") :
                                                  (Math.random() > .5 ? "CR" : "CC");
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
  private isSelected = () => {
    const { backpack } = this.stores;
    const { backpackMouse } = this.props;
    return backpack.isSelected(backpackMouse);
  }
}
