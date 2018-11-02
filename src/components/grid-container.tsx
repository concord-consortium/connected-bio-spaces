import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./grid-container.sass";
import { TopBarComponent } from "./top-bar";
import { LeftNavPanelComponent } from "./left-nav-panel";
import { MainContentComponent } from "./main-content";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class GridContainerComponent extends BaseComponent<IProps, IState> {

  public render() {

    return (
      <div className="grid-container">
        <TopBarComponent />
        <LeftNavPanelComponent />
        <MainContentComponent />
      </div>
    );
  }
}
