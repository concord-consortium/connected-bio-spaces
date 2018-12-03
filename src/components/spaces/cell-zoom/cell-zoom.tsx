import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../../base";
import OrganelleWrapper from "./OrganelleWrapper";

import "./cell-zoom.sass";

interface IProps extends IBaseProps {
  rowIndex: number;
}
interface IState {}

@inject("stores")
@observer
export class CellZoomComponent extends BaseComponent<IProps, IState> {
  public render() {
    const { cellZoom } = this.stores;
    const { rowIndex } = this.props;
    const { cellMouse } = cellZoom.rows[rowIndex];

    return (
      <div className="cell-zoom-panel">
        {
          cellMouse != null &&
            <OrganelleWrapper elementName={`organelle-wrapper-${rowIndex}`} rowIndex={rowIndex}/>
        }
      </div>
    );
  }

}
