import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./app.sass";

import { TopBarComponent } from "./top-bar";
import { LeftNavPanelComponent } from "./left-nav-panel";
import { MainContentComponent } from "./main-content";
import { FullScreenButton } from "./fullscreen-button";

interface IProps extends IBaseProps {
  showTopBar: boolean;
  showLeftPanel: boolean;
  style?: any;
  scale?: number;
}
interface IState {
  showingTopBar: boolean;
}

@inject("stores")
@observer
export class AppComponent extends BaseComponent<IProps, IState> {

  public constructor(props: IProps) {
    super(props);
    this.state = {
      showingTopBar: this.props.showTopBar
    };
  }

  public render() {
    let className = "app-container";
    if (this.props.scale && this.props.scale < 0.65) {
      className += " small-app";
    }

    const { investigationPanelSpace } = this.stores.ui;

    return (
      <div className={className} style={this.props.style}>
        {this.state.showingTopBar && <TopBarComponent />}
        <div className="nav-and-content-container">
          {this.props.showLeftPanel && <LeftNavPanelComponent />}
          <MainContentComponent />
        </div>
        <FullScreenButton
          className={investigationPanelSpace}
          onFullscreenChange={this.handleFullscreenChange} />
      </div>
    );
  }

  private handleFullscreenChange = (isFullscreen: boolean) => {
    // Removing this for now, but we may want it back in the future
    // if (isFullscreen) {
    //   this.setState({
    //     showingTopBar: true
    //   });
    // } else {
    //   this.setState({
    //     showingTopBar: this.props.showTopBar
    //   });
    // }
  }
}
