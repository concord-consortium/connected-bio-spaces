import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./app.sass";

import { GridContainerComponent } from "./grid-container";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class AppComponent extends BaseComponent<IProps, IState> {

  public render() {
    const {ui} = this.stores;
    return (
      <GridContainerComponent>
        {ui.showInvestigationModalSelect}
      </GridContainerComponent>
    );
  }
}
