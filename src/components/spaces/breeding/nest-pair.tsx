import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../../base";
import { INestPair } from "../../../models/spaces/breeding/breeding";
import { BackpackMouse, BackpackMouseType } from "../../../models/backpack-mouse";
import { StackedOrganism } from "../../stacked-organism";
import "./nest-pair.sass";

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
    const { backpack } = this.stores;
    const { backgroundType } = this.stores.breeding;
    const { showNestHighlight, showPairHighlight } = this.props;
    const positionClass = this.getPositionClass();
    const nestHoverImage = this.getNestHoverImage();
    const leftMouse = this.props.nestPair.leftMouse;
    const rightMouse = this.props.nestPair.rightMouse;
    const leftMouseCollected = backpack.cloneExists(leftMouse.id);
    const rightMouseCollected = backpack.cloneExists(rightMouse.id);
    const nestClass = `nest-pair ${positionClass} ` + (showNestHighlight ? "selectable" : "");
    const nestBackgroundHoverClass = `nest-pair-background-hover ${positionClass} ` + (showNestHighlight ? "show" : "");
    const bgClass = backgroundType === "brown" ? "white" : (backgroundType === "white" ? "black" : "");
    const pairLabelClass = `pair-label ${positionClass} `
                           + ((showNestHighlight || showPairHighlight) ? "show " : "") + bgClass;
    const nestInspectClass = `nest-inspect ${positionClass} ` + (showPairHighlight ? "show" : "");
    const leftMouseImages = [leftMouse.nestImage];
    if (leftMouseCollected) leftMouseImages.push(leftMouse.nestOutlineImage);
    const rightMouseImages = [rightMouse.nestImage];
    if (rightMouseCollected) rightMouseImages.push(rightMouse.nestOutlineImage);
    return(
      <div className={nestClass} onClick={this.handleClickNest}>
        <img
          src={nestHoverImage}
          className={nestBackgroundHoverClass}
          data-test="nest-pair-background-image"
        />
        <div className={nestInspectClass} />
        <div className={`mouse left ${positionClass}`} onClick={this.handleClickMouse(leftMouse)}>
          <StackedOrganism
            organism={leftMouse}
            organismImages={leftMouseImages}
            height={80}
            showSelection={this.props.showSelectionStack && !leftMouseCollected}
            showSex={this.props.showSexStack}
            showHetero={this.props.showHeteroStack}
          />
        </div>
        <div className={`mouse right ${positionClass}`} onClick={this.handleClickMouse(rightMouse)}>
          <StackedOrganism
            organism={rightMouse}
            organismImages={rightMouseImages}
            height={80}
            flipped={true}
            showSelection={this.props.showSelectionStack && !rightMouseCollected}
            showSex={this.props.showSexStack}
            showHetero={this.props.showHeteroStack}
          />
        </div>
        <div className={pairLabelClass}>{this.props.nestPair.label}</div>
      </div>
    );
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

  private getNestHoverImage = () => {
    switch (this.props.positionIndex) {
      case 1:
        return "assets/unit/mouse/breeding/nesting/left-top-hover.png";
      case 2:
        return "assets/unit/mouse/breeding/nesting/right-top-hover.png";
      case 3:
        return "assets/unit/mouse/breeding/nesting/left-middle-hover.png";
      case 4:
        return "assets/unit/mouse/breeding/nesting/right-middle-hover.png";
      case 5:
        return "assets/unit/mouse/breeding/nesting/left-bottom-hover.png";
      case 6:
        return "assets/unit/mouse/breeding/nesting/right-bottom-hover.png";
      default:
        return "";
    }
  }

  private handleClickMouse = (mouse: BackpackMouseType) => () => {
    const { breeding } = this.stores;
    const { backpack } = this.stores;
    const selecting = breeding.interactionMode === "select";
    if (selecting && !backpack.cloneExists(mouse.id)) {
      const backpackMouse = BackpackMouse.create({
        species: mouse.species,
        sex: mouse.sex,
        genotype: mouse.genotype,
        label: mouse.label,
        originMouseRefId: mouse.id
      });
      backpack.addCollectedMouse(backpackMouse);
    }
  }

  private handleClickNest = () => {
    const { breeding } = this.stores;
    const nestPair = this.props.nestPair;
    const inspecting = breeding.interactionMode === "inspect";
    const breed = breeding.interactionMode === "breed";
    if (inspecting) {
      breeding.setInspectedNest(nestPair.id);
    } else if (breed) {
      breeding.setNestPairCurrentBreeding(nestPair.id);
    }
  }
}
