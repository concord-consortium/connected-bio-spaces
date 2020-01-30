import { inject, observer } from "mobx-react";
import * as React from "react";
import Slider from "rc-slider";
import { BaseComponent, IBaseProps } from "../../base";
import { StackedOrganism } from "../../stacked-organism";

import "./breeding-view.sass";
import "rc-slider/assets/index.css";

interface IProps extends IBaseProps {}
interface IState {
  litterSliderVal: number;
}

@inject("stores")
@observer
export class BreedingView extends BaseComponent<IProps, IState> {

  public state: IState = {
    litterSliderVal: 0
  };

  public render() {
    const { breeding } = this.stores;
    const activeBreedingPair = breeding.activeBreedingPair!;
    const { mother, father, litters, label, numOffspring } = activeBreedingPair;
    const numLitters = activeBreedingPair.litters.length;
    const offspringClass = "offspring" + (numOffspring === 0 ? " hide" : "");

    const { litterSliderVal } = this.state;
    const maxLitter = numLitters - 1;
    const sliderResolution = numLitters > 50 ? 1 : numLitters > 30 ? 2 : numLitters > 10 ? 10 : 100;
    const sliderMax = Math.max(maxLitter * sliderResolution, 0);
    const sliderPercent = sliderMax ? litterSliderVal / sliderMax : 0;
    const litterOffset = 85 * maxLitter * sliderPercent;
    const currentLitter = maxLitter - Math.round(maxLitter * sliderPercent);

    const sliderClass = "litter-scroll" + (numLitters < 2 ? " hide" : "");
    const trackStyle = { width: 10 };
    const handleStyle = {
      height: 24,
      width: 24
    };
    const railStyle = { width: 10 };

    return (
      <div className="breeding-view">
        <div className="parents">
          <div className="parent-label">
            { label }
          </div>
          <div className="parent mother">
            Mother
            <div className="parent-image">
              <StackedOrganism
                organism={mother}
                organismImages={[mother.nestImage]}
                height={90}
                showSelection={false}
                showSex={breeding.showSexStack}
                showHetero={breeding.showHeteroStack}
              />
            </div>
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
            Father
            <div className="parent-image">
              <StackedOrganism
                organism={father}
                organismImages={[father.nestImage]}
                height={90}
                flipped={true}
                showSelection={false}
                showSex={breeding.showSexStack}
                showHetero={breeding.showHeteroStack}
              />
            </div>
          </div>
        </div>

        <div className={offspringClass} onWheel={this.handleWheel}>
          <div className="litter-number">
            Litter { currentLitter + 1 }
          </div>
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
                      litter.map((org, j) => (
                        <StackedOrganism
                          key={"org" + j}
                          organism={org}
                          organismImages={[org.nestImage]}
                          height={60}
                          showSelection={false}
                          showSex={breeding.showSexStack}
                          showHetero={breeding.showHeteroStack}
                        />
                      ))
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
    const sliderResolution = numLitters > 50 ? 1 : numLitters > 30 ? 2 : numLitters > 10 ? 10 : 100;
    const sliderMax = Math.max((numLitters - 1) * sliderResolution, 0);
    const increment = sliderMax / numLitters;
    const change = e.deltaY > 0
            ? Math.min(litterSliderVal + increment, sliderMax)
            : Math.max(litterSliderVal - increment, 0);
    this.setState({litterSliderVal: change});
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
}
