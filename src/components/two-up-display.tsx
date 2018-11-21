import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";
import { ZoomControl } from "./zoom-control";

import "./two-up-display.sass";

interface IProps extends IBaseProps {
  leftTitle: string;
  leftPanel: React.ReactNode;
  rightTitle: string;
  rightIcon?: string;
  onClickRightIcon?: () => void;
  rightPanel: React.ReactNode;
}
interface IState {}

@inject("stores")
@observer
export class TwoUpDisplayComponent extends BaseComponent<IProps, IState> {

  public render() {
    return (
      <div className="two-up-display" data-test="two-up-display">
        {this.renderLeftPanel()}
        {this.renderRightPanel()}
      </div>
    );
  }

  private renderLeftPanel() {
    return (
      <div className="two-up-panel left-abutment" data-test="two-up-left-panel">
        <div className="header" data-test="two-up-header">
          <div className="title" data-test="two-up-title">{this.props.leftTitle}</div>
        </div>
        <div className="content" data-test="two-up-content">
          {this.props.leftPanel}
        </div>
        <ZoomControl />
      </div>
    );
  }

  private renderRightPanel() {
    return (
      <div className="two-up-panel right-abutment">
        <div className="header">
          {
            this.props.rightIcon ?
              <div className="button-holder" onClick={this.handleClickRightIcon}>
                <svg className="button">
                  <use xlinkHref={this.props.rightIcon} />
                </svg>
              </div>
              : null
            }
          <div className="title">{this.props.rightTitle}</div>
        </div>
        <div className="content">
          {this.props.rightPanel}
        </div>
      </div>
    );
  }

  private handleClickRightIcon = () => {
    if (this.props.onClickRightIcon) this.props.onClickRightIcon();
  }
}
