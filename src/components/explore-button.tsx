import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./explore-button.sass";
import { SpaceType } from "../models/ui";

interface IProps extends IBaseProps {
  space: SpaceType;
  title: string;
}
interface IState {}

@inject("stores")
@observer
export class ExploreButtonComponent extends BaseComponent<IProps, IState> {

  public render() {
    const {ui} = this.stores;
    let classSuffix: string = this.props.space;
    classSuffix += ((ui.investigationPanelSpace === this.props.space) ? " active" : " clickable");
    const buttonClass = "explore-button " + classSuffix;
    const iconClass = "icon " + classSuffix;
    const titleClass = "title " + classSuffix;
    const iconName = "#icon-explore-" + this.props.space;
    return (
      <div className={buttonClass} onClick={this.handleClickButton}>
        <div className={iconClass}>
          <svg className="image">
            <use xlinkHref={iconName} />
          </svg>
        </div>
        <div className={titleClass}>{this.props.title}</div>
      </div>
    );
  }

  private handleClickButton = () => {
    const {ui} = this.stores;
    ui.setInvestigationPanelSpace(this.props.space);
  }
}
