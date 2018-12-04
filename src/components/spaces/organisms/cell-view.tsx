import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../../base";
import OrganelleWrapper from "./organelle-wrapper";

import "./cell-view.sass";

interface IProps extends IBaseProps {
  rowIndex: number;
}
interface IState {}

@inject("stores")
@observer
export class CellZoomComponent extends BaseComponent<IProps, IState> {
  public render() {
    const { organisms } = this.stores;
    const { rowIndex } = this.props;
    const { organismsMouse } = organisms.rows[rowIndex];

    return (
      <div className="cell-zoom-panel">
        {
          organismsMouse != null &&
            <OrganelleWrapper elementName={`organelle-wrapper-${rowIndex}`} rowIndex={rowIndex}/>
        }
      </div>
    );
  }

}
