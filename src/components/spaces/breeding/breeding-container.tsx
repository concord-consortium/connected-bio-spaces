import { inject, observer } from "mobx-react";
import * as React from "react";

import { BaseComponent, IBaseProps } from "../../base";

import "./breeding-container.sass";
import { CollectButtonComponent } from "../../collect-button";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class BreedingContainer extends BaseComponent<IProps, IState> {

  public render() {
    const { breeding } = this.stores;
    return (
      <div className="breeding-container">
        <CollectButtonComponent
          backpackMouse={breeding.mother}
          clickClose={this.clickClose("mother")}
          placeable={false}
        />

        <CollectButtonComponent
          backpackMouse={breeding.father}
          clickClose={this.clickClose("father")}
          placeable={false}
        />
      </div>
    );
  }

  private clickClose(parent: "mother" | "father") {
    return () => this.stores.breeding.removeParent(parent);
  }
}
