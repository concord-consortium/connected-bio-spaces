import { inject, observer } from "mobx-react";
import * as React from "react";

import { BaseComponent, IBaseProps } from "../../base";

import "./breeding-view.sass";
import { CollectButtonComponent } from "../../collect-button";
import { Chromosomes } from "./chromosomes";
import { StackedOrganism } from "../../stacked-organism";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class BreedingView extends BaseComponent<IProps, IState> {

  public render() {
    const { breeding } = this.stores;
    const activeBreedingPair = breeding.activeBreedingPair!;
    const { mother, father, litters, label, numOffspring } = activeBreedingPair;
    const numLitters = activeBreedingPair.litters.length;
    const offspringClass = "offspring" + (numOffspring === 0 ? " hide" : "");

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
            <button className={"nesting-button breed-button"}
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

        <div className={offspringClass}>
          <div className="litter-number">
            Litter { numLitters }
          </div>
          <div className="total-offspring">
            Total offspring { numOffspring }
          </div>
          <div className="litters">
            {
              litters.reverse().map((litter, i) => (
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
          <div className="focus-overlay">
            <div className="focus-overlay-top" />
            <div className="focus-window" />
            <div className="focus-overlay-bottom" />
          </div>
        </div>
      </div>
    );
  }

  private handleClickBreedButton = () => {
    this.stores.breeding.breedLitter();
  }
}
