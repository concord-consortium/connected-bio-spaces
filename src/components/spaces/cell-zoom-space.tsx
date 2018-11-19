import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../base";
import { TwoUpDisplayComponent } from "../two-up-display";
import OrganelleWrapper from "./cell-zoom/OrganelleWrapper";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class CellZoomSpaceComponent extends BaseComponent<IProps, IState> {

  public render() {
    const graphPanel = <div>Graph Placeholder</div>;

    return (
      <TwoUpDisplayComponent
        leftTitle="Investigate: Cell"
        leftPanel={<OrganelleWrapper elementName="organelle-wrapper" />}
        rightTitle={"Graph"}
        rightPanel={graphPanel}
      />
    );
  }

}
