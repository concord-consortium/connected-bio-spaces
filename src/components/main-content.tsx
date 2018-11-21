import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./main-content.sass";
import { PopulationsSpaceComponent } from "./spaces/populations-space";
import { SpaceType } from "../models/ui";

interface IProps extends IBaseProps {}
interface IState {}

type SpaceComponent = typeof PopulationsSpaceComponent;

type SpaceTypeToComponent = {
  [key in SpaceType]: SpaceComponent | undefined
};

const kSpaceComponents: SpaceTypeToComponent = {
  populations: PopulationsSpaceComponent,
  breeding: undefined,
  organism: undefined,
  dna: undefined,
  none: undefined
};

@inject("stores")
@observer
export class MainContentComponent extends BaseComponent<IProps, IState> {

  public render() {
    return (
      <div className="main-content" data-test="main-content">
        {this.renderMainContent()}
      </div>
    );
  }

  private renderMainContent() {
    const {investigationPanelSpace} = this.stores.ui;

    // stawman code
    const ActiveSpaceComponent = kSpaceComponents[investigationPanelSpace];
    if (ActiveSpaceComponent) {
      return <ActiveSpaceComponent/>;
    }
  }
}
