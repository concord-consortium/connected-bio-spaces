import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./main-content.sass";
import { PopulationsSpaceComponent } from "./spaces/populations-space";
import { SpaceType } from "../models/ui";
import { OrganismsSpaceComponent } from "./spaces/organisms-space";

interface IProps extends IBaseProps {}
interface IState {}

type SpaceComponent = typeof PopulationsSpaceComponent |
  typeof OrganismsSpaceComponent;

type SpaceTypeToComponent = {
  [key in SpaceType]: SpaceComponent | undefined
};

const kSpaceComponents: SpaceTypeToComponent = {
  populations: PopulationsSpaceComponent,
  organism: OrganismsSpaceComponent,
  breeding: undefined,
  dna: undefined,
  none: undefined
};

@inject("stores")
@observer
export class MainContentComponent extends BaseComponent<IProps, IState> {

  public render() {
    const {investigationPanelSpace} = this.stores.ui;
    const mainClass = "main-content " + investigationPanelSpace;

    const ActiveSpaceComponent = kSpaceComponents[investigationPanelSpace];
    return (
      <div className={mainClass} data-test="main-content">
        {ActiveSpaceComponent ? <ActiveSpaceComponent/> : null}
      </div>
    );
  }
}
