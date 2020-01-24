import { inject, observer } from "mobx-react";
import * as React from "react";

import { BaseComponent, IBaseProps } from "../../base";

import "./breeding-container.sass";
import { CollectButtonComponent } from "../../collect-button";
import { Chromosomes } from "./chromosomes";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class BreedingView extends BaseComponent<IProps, IState> {

  public render() {
    const { breeding } = this.stores;
    const { mother, father, litter,
      motherGamete, fatherGamete, offspring } = breeding;
    const readyToBreed = mother && father;
    const readyToFertilize = motherGamete && fatherGamete;

    const breedButtonClass = "button-holder" + (readyToBreed ? "" : " disabled");

    return (
      <div className="breeding-container">
        <div className="parent mother">
          Mother
          <CollectButtonComponent
            backpackMouse={mother}
            clickClose={this.clickClose("mother")}
            placeable={false}
          />
          <Chromosomes
            organism={mother}
          />
        </div>
        <div className="parent father">
          Father
          <CollectButtonComponent
            backpackMouse={father}
            clickClose={this.clickClose("father")}
            placeable={false}
          />
          <Chromosomes
            organism={father}
          />
        </div>

        <div className="breed-button">
          <div className={breedButtonClass} onClick={this.breedLitter}>
            Breed
          </div>
        </div>
        <div className="litter">
          {
            litter.map((org, i) =>
              <CollectButtonComponent
                key={`offspring-${i}`}
                backpackMouse={org}
                hideCloseButton={true}
                placeable={false}
              />
            )
          }
        </div>
      </div>
    );
  }

  private breedLitter = () => {
    this.stores.breeding.breedLitter();
  }

  private createGametes = () => {
    this.stores.breeding.createGametes();
  }

  private fertilize = () => {
    this.stores.breeding.fertilize();
  }

  private clickClose(org: "mother" | "father" | "offspring") {
    return () => this.stores.breeding.removeOrganism(org);
  }
}
