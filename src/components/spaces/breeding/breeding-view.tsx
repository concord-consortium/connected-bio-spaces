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
    const { leftMouse, rightMouse } = activeBreedingPair;
    const mother = leftMouse.sex === "female" ? leftMouse : rightMouse;
    const father = leftMouse.sex === "male" ? leftMouse : rightMouse;

    const breedButtonClass = "nesting-button";

    return (
      <div className="breeding-view">
        <div className="parents">
          <div className="parent mother">
            Mother
            <div className="parent-image">
              <StackedOrganism
                organism={mother}
                organismImages={[mother.nestImage]}
                height={110}
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
                height={110}
                flipped={true}
                showSelection={false}
                showSex={breeding.showSexStack}
                showHetero={breeding.showHeteroStack}
              />
            </div>
          </div>
        </div>

        <div className="offspring">
          <div className="litters">
            {/*  */}
          </div>
        </div>
      </div>
    );
  }

  private handleClickBreedButton = () => {
    this.stores.breeding.breedLitter();
  }
}
