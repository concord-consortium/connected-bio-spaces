import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./two-up-display.sass";
import { RightPanelType } from "../models/ui";

const titles: {[key in RightPanelType]: string} = {
  instructions: "Instructions",
  data: "Data",
  information: "Information"
};

interface IProps extends IBaseProps {
  leftTitle: string;
  leftPanel: React.ReactNode;
  instructionsIconEnabled?: boolean;
  dataIconEnabled?: boolean;
  informationIconEnabled?: boolean;
  selectedRightPanel: RightPanelType;
  onClickRightIcon?: (icon: RightPanelType) => void;
  rightPanel: React.ReactNode;
  spaceClass: string;
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
        <div className={"header " + this.props.spaceClass} data-test="left-header">
          <div className="title" data-test="left-title">{this.props.leftTitle}</div>
        </div>
        <div className="content" data-test="left-content">
          {this.props.leftPanel}
        </div>
      </div>
    );
  }

  private renderIcon(panelType: RightPanelType, selectedPanel: RightPanelType, enabled?: boolean) {
    const active = panelType === selectedPanel;
    const className = "button-holder" +
      (enabled ? "" : " disabled") +
      (active ? " active" : "");
    return (
      <div className={className} onClick={this.handleClickRightIcon(panelType, enabled)}>
        <svg className="button" data-test="right-button">
          <use xlinkHref={`#icon-show-${panelType}`} />
        </svg>
      </div>
    );
  }

  private renderRightPanel() {
    const { selectedRightPanel, instructionsIconEnabled, dataIconEnabled, informationIconEnabled } = this.props;
    const title = titles[selectedRightPanel];
    const contentClass = "content" + (selectedRightPanel === "instructions" ? " scrollable" : "");
    return (
      <div className="two-up-panel right-abutment">
        <div className={"header " + this.props.spaceClass} data-test="right-header">
          { this.renderIcon("instructions", selectedRightPanel, instructionsIconEnabled) }
          { this.renderIcon("data", selectedRightPanel, dataIconEnabled) }
          { this.renderIcon("information", selectedRightPanel, informationIconEnabled) }
          <div className="title" data-test="right-title">{title}</div>
        </div>
        <div className={contentClass} data-test="right-content">
          {this.props.rightPanel}
        </div>
        <div className={"footer " + this.props.spaceClass} data-test="right-footer"/>
      </div>
    );
  }

  private handleClickRightIcon = (icon: RightPanelType, enabled?: boolean) => {
    const { onClickRightIcon } = this.props;
    if (enabled && onClickRightIcon) {
      return () => onClickRightIcon(icon);
    }
  }
}
