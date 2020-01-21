import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../../base";

import "./nest-pair.sass";
import { INestPair } from "../../../models/spaces/breeding/breeding";
import { BackpackMouse } from "../../../models/backpack-mouse";

interface IProps extends IBaseProps {}
interface IState {}

interface IProps extends IBaseProps {
  nestPair: INestPair;
  positionIndex: number;
  showSexStack: boolean;
  showHeteroStack: boolean;
  showSelectionStack: boolean;
  showNestHighlight: boolean;
  showPairHighlight: boolean;
}

@inject("stores")
@observer
export class NestPair extends BaseComponent<IProps, IState> {

  public render() {
    const { showHeteroStack, showNestHighlight, showPairHighlight } = this.props;
    const positionClass = this.getPositionClass();
    const nestImage = this.getNestImage();
    const nestHoverImage = this.getNestHoverImage();
    const leftMouse = this.props.nestPair.leftMouse;
    const rightMouse = this.props.nestPair.rightMouse;
    const leftMouseCollected = this.isMouseCollected(this.props.nestPair.leftMouseBackpackId);
    const rightMouseCollected = this.isMouseCollected(this.props.nestPair.rightMouseBackpackId);
    const leftMouseImage = leftMouse.nestImage;
    const rightMouseImage = rightMouse.nestImage;
    const leftSexImage = leftMouse.sex === "female"
                          ? "assets/curriculum/mouse/populations/female-stack.png"
                          : "assets/curriculum/mouse/populations/male-stack.png";
    const rightSexImage = rightMouse.sex === "female"
                          ? "assets/curriculum/mouse/populations/female-stack.png"
                          : "assets/curriculum/mouse/populations/male-stack.png";
    const heteroImage = "assets/curriculum/mouse/populations/heterozygous-stack.png";
    const selectionImage = "assets/curriculum/mouse/populations/select-stack.png";
    const mouseOutlineImage = "assets/curriculum/mouse/breeding/nesting/nest_mouse_outline.png";
    const nestClass = `nest-pair ${positionClass} ` + (showNestHighlight ? "selectable" : "");
    const rightSelectionClass = "selection-stack " +
                                ((this.props.showSelectionStack && !rightMouseCollected) ? "show" : "");
    const leftSelectionClass = "selection-stack " +
                               ((this.props.showSelectionStack && !leftMouseCollected) ? "show" : "");
    const sexClass = "sex-stack " + (this.props.showSexStack ? "show" : "");
    const leftHeteroClass = "hetero-stack " + ((showHeteroStack && leftMouse.isHeterozygote) ? "show" : "");
    const rightHeteroClass = "hetero-stack " + ((showHeteroStack && rightMouse.isHeterozygote) ? "show" : "");
    const nestBackgroundHoverClass = `nest-pair-background-hover ${positionClass} ` + (showNestHighlight ? "show" : "");
    const pairLabelClass = `pair-label ${positionClass} ` + ((showNestHighlight || showPairHighlight) ? "show" : "");
    const nestInspectClass = `nest-inspect ${positionClass} ` + (showPairHighlight ? "show" : "");
    const rightMouseOutlineClass = `mouse-image outline flip ` + (rightMouseCollected ? "show" : "");
    const leftMouseOutlineClass = `mouse-image outline ` + (leftMouseCollected ? "show" : "");

    return(
      <div className={nestClass} onClick={this.handleClickNest}>
        <img
          src={nestImage}
          className={`nest-pair-background ${positionClass}`}
          data-test="nest-pair-background-image"
        />
        <img
          src={nestHoverImage}
          className={nestBackgroundHoverClass}
          data-test="nest-pair-background-image"
        />
        <div className={nestInspectClass} />
        <div className={`mouse left ${positionClass}`} onClick={this.handleClickLeftMouse}>
          <img src={selectionImage} className={leftSelectionClass} data-test="mouse-selection-image" />
          <img src={leftMouseImage} className={`mouse-image`} data-test="mouse-image" />
          <img src={mouseOutlineImage} className={leftMouseOutlineClass} data-test="mouse-outline-image" />
          <img src={heteroImage} className={leftHeteroClass} data-test="mouse-hetero-image" />
          <img src={leftSexImage} className={sexClass} data-test="mouse-sex-image" />
        </div>
        <div className={`mouse right ${positionClass}`} onClick={this.handleClickRightMouse}>
          <img src={selectionImage} className={rightSelectionClass} data-test="mouse-selection-image" />
          <img src={rightMouseImage} className={`mouse-image flip`} data-test="mouse-image" />
          <img src={mouseOutlineImage} className={rightMouseOutlineClass} data-test="mouse-outline-image" />
          <img src={heteroImage} className={rightHeteroClass} data-test="mouse-hetero-image" />
          <img src={rightSexImage} className={sexClass} data-test="mouse-sex-image" />
        </div>
        <div className={pairLabelClass}>{this.props.nestPair.label}</div>
      </div>
    );
  }

  private isMouseCollected = (id: string | undefined) => {
    if (id) {
      const { backpack } = this.stores;
      const mouse = backpack.collectedMice.find(bpMouse => bpMouse.id === id);
      if (mouse) {
        return true;
      }
    }
    return false;
  }

  private getPositionClass = () => {
    switch (this.props.positionIndex) {
      case 1:
        return "left-top";
      case 2:
        return "right-top";
      case 3:
        return "left-middle";
      case 4:
        return "right-middle";
      case 5:
        return "left-bottom";
      case 6:
        return "right-bottom";
      default:
        return "";
    }
  }

  private getNestImage = () => {
    switch (this.props.positionIndex) {
      case 1:
        return "assets/curriculum/mouse/breeding/nesting/left-top.png";
      case 2:
        return "assets/curriculum/mouse/breeding/nesting/right-top.png";
      case 3:
        return "assets/curriculum/mouse/breeding/nesting/left-middle.png";
      case 4:
        return "assets/curriculum/mouse/breeding/nesting/right-middle.png";
      case 5:
        return "assets/curriculum/mouse/breeding/nesting/left-bottom.png";
      case 6:
        return "assets/curriculum/mouse/breeding/nesting/right-bottom.png";
      default:
        return "";
    }
  }

  private getNestHoverImage = () => {
    switch (this.props.positionIndex) {
      case 1:
        return "assets/curriculum/mouse/breeding/nesting/left-top-hover.png";
      case 2:
        return "assets/curriculum/mouse/breeding/nesting/right-top-hover.png";
      case 3:
        return "assets/curriculum/mouse/breeding/nesting/left-middle-hover.png";
      case 4:
        return "assets/curriculum/mouse/breeding/nesting/right-middle-hover.png";
      case 5:
        return "assets/curriculum/mouse/breeding/nesting/left-bottom-hover.png";
      case 6:
        return "assets/curriculum/mouse/breeding/nesting/right-bottom-hover.png";
      default:
        return "";
    }
  }

  private handleClickLeftMouse = () => {
    const { breeding } = this.stores;
    const selecting = breeding.interactionMode === "select";
    if (selecting) {
      const { backpack } = this.stores;
      const nestMouse = this.props.nestPair.leftMouse;
      const backpackMouse = BackpackMouse.create({sex: nestMouse.sex,
                                                  genotype: nestMouse.genotype,
                                                  label: nestMouse.label});
      backpack.addCollectedMouse(backpackMouse);
      breeding.setNestPairLeftMouseBackpackId(this.props.nestPair.id, backpackMouse.id);
    }
  }

  private handleClickRightMouse = () => {
    const { breeding } = this.stores;
    const selecting = breeding.interactionMode === "select";
    if (selecting) {
      const { backpack } = this.stores;
      const nestMouse = this.props.nestPair.rightMouse;
      const backpackMouse = BackpackMouse.create({sex: nestMouse.sex,
                                                  genotype: nestMouse.genotype,
                                                  label: nestMouse.label});
      backpack.addCollectedMouse(backpackMouse);
      breeding.setNestPairRightMouseBackpackId(this.props.nestPair.id, backpackMouse.id);
    }
  }

  private handleClickNest = () => {
    const { breeding } = this.stores;
    const nestPair = this.props.nestPair;
    const inspecting = breeding.interactionMode === "inspect";
    if (inspecting) {
      breeding.setInspectedNest(nestPair.id);
    }
  }
}
