import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../../base";
import { INestPair } from "../../../models/spaces/breeding/breeding";
import { BackpackMouse, BackpackMouseType } from "../../../models/backpack-mouse";
import { StackedOrganism } from "../../stacked-organism";
import { units } from "../../../models/units";
import "./nest-pair.sass";
import "./nest-pair.pea.sass";

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
    const { showNestHighlight, showPairHighlight, positionIndex } = this.props;
    const unit = this.props.nestPair.leftMouse.species;
    const unitBreeding = units[unit].breeding;

    const positionClass = this.getPositionClass();
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
    const nestHoverImage = unitBreeding.getNestHoverImage ? unitBreeding.getNestHoverImage(positionIndex) : null;
    const nestPlatformImage = unitBreeding.getNestPlatformImage
      ? unitBreeding.getNestPlatformImage(positionIndex) : null;

    return(
      <div className={`${nestClass} ${unit}`} onClick={this.handleClickNest}>
        <div className={nestInspectClass} />
        { nestPlatformImage &&
          <img
            src={nestPlatformImage}
            className={"nest-platform"}
            data-test="nest-platform-image"
          />
        }
        { nestHoverImage &&
          <img
            src={nestHoverImage}
            className={nestBackgroundHoverClass}
            data-test="nest-pair-background-image"
          />
        }
        { !nestHoverImage &&
          <div className={nestBackgroundHoverClass} />
        }
        <div className={`mouse left ${positionClass}`} onClick={this.handleClickMouse(leftMouse)}>
          <StackedOrganism
            organism={leftMouse}
            organismImages={leftMouseImages}
            height={unitBreeding.nestParentSize}
            showSelection={this.props.showSelectionStack && !leftMouseCollected}
            showSex={this.props.showSexStack}
            showHetero={this.props.showHeteroStack}
            ignoreHeteroStyleAdjustment={unit === "pea"}
          />
        </div>
        <div className={`mouse right ${positionClass}`} onClick={this.handleClickMouse(rightMouse)}>
          <StackedOrganism
            organism={rightMouse}
            organismImages={rightMouseImages}
            height={unitBreeding.nestParentSize}
            flipped={unitBreeding.flipRightNestParent}
            showSelection={this.props.showSelectionStack && !rightMouseCollected}
            showSex={this.props.showSexStack}
            showHetero={this.props.showHeteroStack}
            ignoreHeteroStyleAdjustment={unit === "pea"}
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
