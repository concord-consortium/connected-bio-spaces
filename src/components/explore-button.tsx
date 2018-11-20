import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./explore-button.sass";
import { Spaces } from "../models/ui";

interface IProps extends IBaseProps {
  space: Spaces;
  title: string;
}
interface IState {}

@inject("stores")
@observer
export class ExploreButtonComponent extends BaseComponent<IProps, IState> {

  public render() {
    const {ui} = this.stores;
    let classSuffix: string = ((ui.investigationPanelSpace === this.props.space) ? "active" : "clickable");
    switch (this.props.space) {
      case "populations":
        classSuffix = "population " + classSuffix;
        break;
      case "organism":
        classSuffix = "organism " + classSuffix;
        break;
      case "breeding":
        classSuffix = "breeding " + classSuffix;
        break;
      case "dna":
        classSuffix = "dna " + classSuffix;
        break;
    }
    const buttonClass = "explore-button " + classSuffix;
    const iconClass = "icon " + classSuffix;
    const titleClass = "title " + classSuffix;
    return (
      <div className={buttonClass} onClick={this.handleClickButton}>
        <div className={iconClass} />
        <div className={titleClass}>{this.props.title}</div>
      </div>
    );
  }

  private handleClickButton = () => {
    const {ui} = this.stores;
    ui.setInvestigationPanelSpace(this.props.space);
  }
}
