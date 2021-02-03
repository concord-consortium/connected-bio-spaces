import { inject, observer } from "mobx-react";
import * as React from "react";
import Slider from "rc-slider";
import { BaseComponent, IBaseProps } from "../../base";
import { StackedOrganism } from "../../stacked-organism";
import { gameteHTMLLabel } from "../../../utilities/genetics";
import { ArrowPanel, ArrowInfo } from "./arrow-panel";
import { BackpackMouse, BackpackMouseType } from "../../../models/backpack-mouse";

import "./breeding-view.sass";
import "./breeding-view.pea.sass";
import "rc-slider/assets/index.css";
import { units } from "../../../models/units";

interface IProps extends IBaseProps {}
interface IState {
  litterSliderVal: number;
  offspringHightlightIndex: number;
  parentHightlightIndex: number;
}

@inject("stores")
@observer
export class BreedingView extends BaseComponent<IProps, IState> {

  public state: IState = {
    litterSliderVal: 0,
    offspringHightlightIndex: -1,
    parentHightlightIndex: -1
  };

  public render() {
    const { breeding, unit } = this.stores;
    const { backpack } = this.stores;
    const unitBreeding = units[unit].breeding;
    const activeBreedingPair = breeding.activeBreedingPair!;
    const { mother, father, litters, label, numOffspring, id } = activeBreedingPair;
    const numLitters = litters.length;
    const offspringClass = "offspring" + (numOffspring === 0 ? " hide" : "");
    const showGametes = breeding.interactionMode === "gametes";
    const { litterSliderVal } = this.state;
    const maxLitter = numLitters - 1;
    const sliderMax = this.getSliderMax(numLitters);
    const sliderPercent = sliderMax ? litterSliderVal / sliderMax : 0;
    const litterOffset = 85 * maxLitter * sliderPercent;
    const currentLitter = maxLitter - Math.round(maxLitter * sliderPercent);
    const gametes = activeBreedingPair.getLitterGametes(currentLitter);
    const gametePositions = activeBreedingPair.getLitterShuffledGametePositions(currentLitter);
    const sliderClass = "litter-scroll" + (numLitters < 2 ? " hide" : "");
    const trackStyle = { width: 10 };
    const handleStyle = {
      height: 24,
      width: 24
    };
    const railStyle = { width: 10 };

    const motherCollected = backpack.cloneExists(mother.id);
    const fatherCollected = backpack.cloneExists(father.id);
    const motherImages = [mother.zoomedInParentImage];
    if (motherCollected) motherImages.push(mother.nestOutlineImage);
    const fatherImages = [father.zoomedInParentImage];
    if (fatherCollected) fatherImages.push(father.nestOutlineImage);

    return (
      <div className={`breeding-view ${unit}`}>
        <div className="parents">
          <div className="parent-label">
            { label }
          </div>
          {showGametes && <div className="gametes-box mother"/>}
          {showGametes && <div className="gametes-box father"/>}
          {showGametes && <div className="gametes-message">
            Gametes given to offspring
          </div>}
          <div className="parent mother">
            {mother.label}
            <div className="parent-image"
                 onMouseEnter={this.handleParentHoverEnter(0)}
                 onMouseLeave={this.handleParentHoverExit}
                 onClick={this.handleClickMouse(mother, id, -1, true)}>
              <StackedOrganism
                organism={mother}
                organismImages={motherImages}
                height={unitBreeding.parentSize}
                showSelection={breeding.interactionMode === "select" && !motherCollected}
                showGameteSelection={showGametes && this.state.parentHightlightIndex === 0}
                showInspect={breeding.interactionMode === "inspect"}
                showSex={breeding.showSexStack}
                showHetero={breeding.showHeteroStack}
                showLabel={showGametes}
                isOffspring={false}
              />
            </div>
            { showGametes && <div className="gametes">
                { this.renderGametes(gametes.leftMouseGametes, gametePositions.leftMouse, true) }
            </div> }
          </div>
          <div className="breed-button-container">
            <button className={"breeding-button breed-button"}
                      onClick={this.handleClickBreedButton} data-test="inspect-button">
              <svg className={"icon breed"}>
                <use xlinkHref="#icon-breed" />
              </svg>
              <div className="label">Breed</div>
            </button>
          </div>
          <div className="parent father">
            {father.label}
            <div className="parent-image"
                 onMouseEnter={this.handleParentHoverEnter(1)}
                 onMouseLeave={this.handleParentHoverExit}
                 onClick={this.handleClickMouse(father, id, -1, true)}>
              <StackedOrganism
                organism={father}
                organismImages={fatherImages}
                height={unitBreeding.parentSize}
                flipped={true}
                showSelection={breeding.interactionMode === "select" && !fatherCollected}
                showGameteSelection={showGametes && this.state.parentHightlightIndex === 1}
                showInspect={breeding.interactionMode === "inspect"}
                showSex={breeding.showSexStack}
                showHetero={breeding.showHeteroStack}
                showLabel={showGametes}
                isOffspring={false}
              />
            </div>
            { showGametes && <div className="gametes">
            { this.renderGametes(gametes.rightMouseGametes, gametePositions.rightMouse, false) }
            </div> }
          </div>
        </div>
        { showGametes && this.renderArrowPanel(gametePositions.leftMouse, gametePositions.rightMouse) }
        <div className={offspringClass} onWheel={this.handleWheel}>
          <div className="litter-number">
            Litter { currentLitter + 1 }
          </div>
          {showGametes && <div className="alleles-message">
            Alleles received from parents
          </div>}
          <div className="total-offspring">
            Total offspring { numOffspring }
          </div>
          <div className="reset-button-container">
            <button className={"breeding-button reset-button"}
                      onClick={this.handleClickResetButton} data-test="inspect-button">
              <svg className={"icon breed"}>
                <use xlinkHref="#icon-reset" />
              </svg>
              <div className="label">Reset</div>
            </button>
          </div>
          <div className="litters-container">
            <div className="litters" style={{top: -litterOffset}}>
              {
                litters.slice().reverse().map((litter, i) => (
                  <div className="litter" key={"litter" + label + (litters.length - i)}>
                    {
                      litter.map((org, j) => {
                        const litterNum = litters.length - i;
                        const orgCollected = backpack.cloneExists(org.id);
                        const orgImages = [org.offspringImage];
                        if (orgCollected) orgImages.push(org.nestOutlineImage);
                        return (
                          <div
                            className="offspring-container"
                            onMouseEnter={currentLitter === (litterNum - 1)
                                          ? this.handleOffspringHoverEnter(j)
                                          : undefined}
                            onMouseLeave={currentLitter === (litterNum - 1)
                                          ? this.handleOffspringHoverExit
                                          : undefined}
                            onClick={currentLitter === (litterNum - 1)
                                     ? this.handleClickMouse(org, id, litters.length - i - 1, false)
                                     : undefined}
                            key={"org-cont" + j}>
                            <StackedOrganism
                              key={"org" + j}
                              organism={org}
                              organismImages={orgImages}
                              height={unitBreeding.offspringSize}
                              showSelection={breeding.interactionMode === "select"
                                            && !orgCollected
                                            && currentLitter === (litterNum - 1)}
                              showGameteSelection={showGametes
                                                  && currentLitter === (litterNum - 1)
                                                  && j === this.state.offspringHightlightIndex}
                              showInspect={breeding.interactionMode === "inspect"
                                          && currentLitter === (litterNum - 1)}
                              showSex={breeding.showSexStack}
                              showHetero={breeding.showHeteroStack}
                              showLabel={showGametes}
                              isOffspring={true}
                            />
                          </div>
                        );
                      })
                    }
                  </div>
                ))
              }
            </div>
          </div>
          <div className="focus-overlay">
            <div className="focus-overlay-top" />
            <div className="focus-window" />
            <div className="focus-overlay-bottom" />
          </div>
          <Slider className={sliderClass}
            onChange={this.handleLitterScrollChange}
            min={0}
            max={sliderMax}
            value={litterSliderVal}
            vertical={true}
            reverse={true}
            disabled={numLitters < 2}
            trackStyle={trackStyle}
            handleStyle={handleStyle}
            railStyle={railStyle}
          />
        </div>
      </div>
    );
  }

  private handleWheel = (e: any) => {
    const { breeding } = this.stores;
    const { litterSliderVal } = this.state;
    const activeBreedingPair = breeding.activeBreedingPair!;
    const numLitters = activeBreedingPair.litters.length;
    const sliderMax = this.getSliderMax(numLitters);
    const scrollIncrement = sliderMax / numLitters * .5;
    const change = e.deltaY > 0
            ? Math.min(litterSliderVal + scrollIncrement, sliderMax)
            : Math.max(litterSliderVal - scrollIncrement, 0);
    this.setState({litterSliderVal: change});
  }

  private getSliderMax = (numLitters: number) => {
    const sliderResolution = numLitters > 50 ? 1 : numLitters > 30 ? 2 : numLitters > 10 ? 10 : 100;
    const sliderMax = Math.max((numLitters - 1) * sliderResolution, 0);
    return sliderMax;
  }

  private renderGametes = (gametes: string[], gametePositions: number[], mother: boolean) => {
    const parentIndex = mother ? 0 : 1;
    const iconClass = mother ? "icon egg " : "icon sperm ";
    const { offspringHightlightIndex, parentHightlightIndex } = this.state;
    return(
      gametePositions.map((position, i) => {
        const offset = i % 2 === 0 ? -6 : 0;
        const gamete = gametes[position];
        const highlightMouse = offspringHightlightIndex === position;
        const highlightParent = parentHightlightIndex === parentIndex;
        const gameteViewClass = "hover-view " + (highlightMouse || highlightParent ? "show " : "")
                                + (highlightMouse ? "tall" : "");
        const gameteIconClass = iconClass + (highlightMouse ? "highlight" : "");
        return(
          <div className="gamete" key={i} style={{marginTop: offset}}
               onMouseEnter={this.handleOffspringHoverEnter(position)}
               onMouseLeave={this.handleOffspringHoverExit}>
            <div className={gameteViewClass} />
            <div className={gameteIconClass} />
            <div className="info-data" dangerouslySetInnerHTML={{
                __html: gameteHTMLLabel(gamete)
            }} />
          </div>
        );
      })
    );
  }

  private handleOffspringHoverEnter = (index: number) => () => {
    this.setState({offspringHightlightIndex: index});
  }
  private handleOffspringHoverExit = () => {
    this.setState({offspringHightlightIndex: -1});
  }
  private handleParentHoverEnter = (index: number) => () => {
    this.setState({parentHightlightIndex: index});
  }
  private handleParentHoverExit = () => {
    this.setState({parentHightlightIndex: -1});
  }

  private renderArrowPanel = (gameteLeftPositions: number[], gameteRightPositions: number[]) => {
    const hoverArrows: ArrowInfo[] = [];
    // calculate arrow offset due to scrolling
    const { breeding } = this.stores;
    const { litterSliderVal, offspringHightlightIndex } = this.state;
    const activeBreedingPair = breeding.activeBreedingPair!;
    const numLitters = activeBreedingPair.litters.length;
    const sliderMax = this.getSliderMax(numLitters);
    const sliderInterval = numLitters > 1 ? sliderMax / (numLitters - 1) : 100;
    const sliderOffset = litterSliderVal % sliderInterval;
    const scrollAmount = numLitters > 1
                         ? (sliderOffset < sliderInterval / 2 ? -1 * sliderOffset : sliderInterval - sliderOffset)
                         : 0;
    const scrollYAdjustment = 82 * (scrollAmount / sliderInterval);

    const maxGametes = 5;
    const gameteCount = gameteLeftPositions.length;
    const baseEndY = 46 + scrollYAdjustment;
    const yStagger = 16;
    const leftGameteXStart = 18;
    const rightGameteXStart = 201;
    const gameteXOffset = (maxGametes - gameteCount) * 10;
    const gameteYStagger = 6;
    const gameteDelta = 20;
    const mouseXStart = 48;
    const mouseXOffset = (maxGametes - gameteCount) * 24;
    const mouseXIncrement = 48;
    const arrowGap = 15;
    gameteLeftPositions.forEach((position, i) => {
      const startY = i % 2 === 1 ? gameteYStagger : 0;
      const endY = baseEndY + (position % 2 === 1 ? yStagger : 0);
      const startX = leftGameteXStart + gameteXOffset + i * gameteDelta;
      const endX = mouseXStart + mouseXOffset + position * mouseXIncrement;
      const visible = offspringHightlightIndex === position;
      const arrow: ArrowInfo = { startX, endX, startY, endY, headRotation: -10, visible };
      hoverArrows.push(arrow);
    });
    gameteRightPositions.forEach((position, i) => {
      const startY = i % 2 === 1 ? gameteYStagger : 0;
      const endY = baseEndY + (position % 2 === 1 ? yStagger : 0);
      const startX = rightGameteXStart + gameteXOffset + i * gameteDelta;
      const endX = mouseXStart + mouseXOffset + position * mouseXIncrement + arrowGap;
      const visible = offspringHightlightIndex === position;
      const arrow: ArrowInfo = { startX, endX, startY, endY, headRotation: 10, visible };
      hoverArrows.push(arrow);
    });

    return(
      <ArrowPanel arrows={hoverArrows} />
    );
  }

  private handleClickBreedButton = () => {
    this.stores.breeding.breedLitter();
    this.setState({litterSliderVal: 0});
  }

  private handleClickResetButton = () => {
    this.stores.breeding.clearLitters();
  }

  private handleLitterScrollChange = (value: number) => {
    this.setState({litterSliderVal: value});
  }

  private handleClickMouse = (mouse: BackpackMouseType,
                              pairId: string,
                              litterIndex: number,
                              isParent: boolean) => () => {
    const { breeding } = this.stores;
    const { backpack } = this.stores;
    const inspecting = breeding.interactionMode === "inspect";
    const showGametes = breeding.interactionMode === "gametes";
    const selecting = breeding.interactionMode === "select";
    if (inspecting) {
      breeding.setInspectedMouse(mouse.id, pairId, litterIndex, isParent);
    } else if (showGametes) {
      breeding.setInspectedGamete(mouse.id, pairId, litterIndex, isParent);
    } else if (selecting && !backpack.cloneExists(mouse.id)) {
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

}
