import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./two-up-display.sass";

interface IProps extends IBaseProps {
  leftTitle: string;
  leftPanel: React.ReactNode;
  rightTitle: string;
  rightIcon?: string;
  onClickRightIcon?: (row?: number) => void;
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
      <div className="two-up-panel left-abutment" data-test="left-panel">
        <div className="header" data-test="left-header">
          <div className="title" data-test="left-title">{this.props.leftTitle}</div>
        </div>
        <div className="content" data-test="left-content">
          {this.props.leftPanel}
        </div>
      </div>
    );
  }

  private renderRightPanel() {
    return (
      <div className="two-up-panel right-abutment">
        <div className="header" data-test="right-header">
          {
            this.props.rightIcon ?
              <div className="button-holder" onClick={this.handleClickRightIcon}>
                <svg className="button" data-test="right-button">
                  <use xlinkHref={this.props.rightIcon} />
                </svg>
              </div>
              : null
            }
          <div className="title" data-test="right-title">{this.props.rightTitle}</div>
        </div>
        <div className="content scrollable" data-test="right-content">
          {this.props.rightPanel}
        </div>
        <div className="footer" data-test="right-footer"/>
      </div>
    );
  }

  private handleClickRightIcon = () => {
    if (this.props.onClickRightIcon) this.props.onClickRightIcon();
  }
}
