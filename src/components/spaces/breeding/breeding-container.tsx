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
    const { mother, father } = breeding;

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
      </div>
    );
  }

  private clickClose(parent: "mother" | "father") {
    return () => this.stores.breeding.removeParent(parent);
  }
}
