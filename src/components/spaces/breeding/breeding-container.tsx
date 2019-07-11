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
export class BreedingContainer extends BaseComponent<IProps, IState> {

  public render() {
    const { breeding } = this.stores;
    const { breedingType, mother, father, litter,
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

        {
          breedingType === "litter" &&
          <React.Fragment>
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
          </React.Fragment>
        }

        {
          breedingType === "singleGamete" &&
          <React.Fragment>
            <div className="breed-button gametes">
              {
                !readyToFertilize && !offspring &&
                <div className={breedButtonClass} onClick={this.createGametes}>
                  Create Gametes
                </div>
              }
              {
                readyToFertilize &&
                <div className={breedButtonClass} onClick={this.fertilize}>
                  Fertilize
                </div>
              }
            </div>
            <div className="gamete-container">
              {
                motherGamete &&
                <div className="mother-gamete">
                  <Chromosomes
                    gamete={JSON.parse(motherGamete)}
                  />
                </div>
              }
              {
                fatherGamete &&
                <div className="father-gamete">
                  <Chromosomes
                    gamete={JSON.parse(fatherGamete)}
                    onRight={true}
                  />
                </div>
              }
            </div>
            {
              offspring &&
              <div className="offspring">
                <CollectButtonComponent
                  backpackMouse={offspring}
                  clickClose={this.clickClose("offspring")}
                  placeable={false}
                />
                <Chromosomes
                  organism={offspring}
                />
              </div>
            }
          </React.Fragment>
        }
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
