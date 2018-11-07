import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./app.sass";

import { TopBarComponent } from "./top-bar";
import { LeftNavPanelComponent } from "./left-nav-panel";
import { MainContentComponent } from "./main-content";
import { urlParams } from "../utilities/url-params";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class AppComponent extends BaseComponent<IProps, IState> {

  public render() {
    return (
      <div className="app-container">
        {urlParams.topBar && <TopBarComponent />}
        <div className="nav-and-content-container">
          <LeftNavPanelComponent />
          <MainContentComponent />
        </div>
      </div>
    );
  }
}
