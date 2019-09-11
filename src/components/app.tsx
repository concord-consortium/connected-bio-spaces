import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./app.sass";

import { TopBarComponent } from "./top-bar";
import { LeftNavPanelComponent } from "./left-nav-panel";
import { MainContentComponent } from "./main-content";
import { FullScreenButton } from "./fullscreen-button";

interface IProps extends IBaseProps {
  showTopBar?: boolean;
  style?: any;
  scale?: number;
}
interface IState {}

@inject("stores")
@observer
export class AppComponent extends BaseComponent<IProps, IState> {

  public render() {
    let className = "app-container";
    if (this.props.scale && this.props.scale < 0.65) {
      className += " small-app";
    }
    const { investigationPanelSpace } = this.stores.ui;
    return (
      <div className={className} style={this.props.style}>
        {this.props.showTopBar && <TopBarComponent />}
        <div className="nav-and-content-container">
          <LeftNavPanelComponent />
          <MainContentComponent />
        </div>
        <FullScreenButton className={investigationPanelSpace} />
      </div>
    );
  }
}
