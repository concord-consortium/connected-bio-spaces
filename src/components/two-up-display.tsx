import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./two-up-display.sass";
import { RightPanelType } from "../models/ui";
import { ToolbarButton } from "../models/spaces/populations/populations";

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
  rowNumber?: number;
  rightPanelButtons?: ToolbarButton[];
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
    let abutmentClass: string = " right-abutment";
    if (this.props.rowNumber !== undefined) {
      abutmentClass += this.props.rowNumber === 0 ? " bottom-abutment" : " top-abutment";
    }
    return (
      <div className={"two-up-panel" + abutmentClass} data-test="left-panel">
        <div className={"header " + this.props.spaceClass} data-test="left-header">
          <div className="title" data-test="left-title">{this.props.leftTitle}</div>
        </div>
        <div className={"content " + this.props.spaceClass} data-test="left-content">
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
    let abutmentClass: string = " left-abutment";
    if (this.props.rowNumber !== undefined) {
      abutmentClass += this.props.rowNumber === 0 ? " bottom-abutment " : " top-abutment";
    }
    const contentClass = "content " + (selectedRightPanel === "instructions" ? " scrollable " : "")
                                    + (selectedRightPanel === "data" ? "resizetofit " : "")
                                    + this.props.spaceClass;
    return (
      <div className={"two-up-panel" + abutmentClass}>
        <div className={"header " + this.props.spaceClass} data-test="right-header">
          { this.renderIcon("instructions", selectedRightPanel, instructionsIconEnabled) }
          { this.renderIcon("data", selectedRightPanel, dataIconEnabled) }
          { this.renderIcon("information", selectedRightPanel, informationIconEnabled) }
          <div className="title" data-test="right-title">{title}</div>
        </div>
        <div className={contentClass} data-test="right-content">
          {this.props.rightPanel}
        </div>
        {this.renderRightPanelFooter()}
        {this.renderFloatButtons()}
      </div>
    );
  }

  private renderRightPanelFooter() {
    const footerClass = "footer " + this.props.spaceClass + " " + this.props.selectedRightPanel;

    let buttons = null;
    if (this.props.rightPanelButtons) {
      buttons = this.props.rightPanelButtons.map( (button: any) => {
        const type = button.type || "button";
        if (type === "button" && this.props.selectedRightPanel === button.section) {
          let className = "button-holder" + (button.value ? " active" : "");
          let action = button.action;
          if (button.disabled) {
            className += " disabled";
            action = null;
          }
          return (
            <div key={button.title} className={className} onClick={action}>
              {button.title}
            </div>
          );
        }
      });
    }
    return (
      <div className={footerClass} data-test="right-footer">
        { buttons ? buttons : null }
      </div>
    );
  }

  private renderFloatButtons() {
    if (this.props.rightPanelButtons) {
      let buttons = null;
      buttons = this.props.rightPanelButtons.map( (button: any) => {
        const type = button.type || "button";
        if (type === "float-button" && this.props.selectedRightPanel === button.section) {
          let title = button.title;
          if (button.title === "Scale") {
            title = button.value ? "Show Recent Data" : "Show All Data";
          }
          const buttonClass = "button-holder " + type + " " + button.floatCorner;
          return (
            <div key={button.title} className={buttonClass} onClick={button.action}>
              {title}
            </div>
          );
        }
      });

      return (
        <div className="float-buttons" data-test="right-float-buttons">
          { buttons ? buttons : null }
        </div>
      );
    } else {
      return null;
    }
  }

  private handleClickRightIcon = (icon: RightPanelType, enabled?: boolean) => {
    const { onClickRightIcon } = this.props;
    if (enabled && onClickRightIcon) {
      return () => onClickRightIcon(icon);
    }
  }
}
