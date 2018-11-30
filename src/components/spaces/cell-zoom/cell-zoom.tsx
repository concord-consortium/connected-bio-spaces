import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../../base";
import OrganelleWrapper from "./OrganelleWrapper";
import { CollectButtonComponent } from "../../collect-button";

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
        <CollectButtonComponent
          backpackMouse={cellMouse && cellMouse.backpackMouse}
          clickMouse={this.clickMouse}
          clickEmpty={this.clickEmpty}
          clickClose={this.clickClose}
        />
        {
          cellMouse != null &&
            <OrganelleWrapper elementName={`organelle-wrapper-${rowIndex}`} rowIndex={rowIndex}/>
        }
      </div>
    );
  }

  private clickMouse = () => {
    // Clicks only work on empty slots
  }

  private clickEmpty = () => {
    const { backpack, cellZoom } = this.stores;
    const { rowIndex } = this.props;
    const { activeMouse } = backpack;
    if (activeMouse != null) {
      cellZoom.setRowBackpackMouse(rowIndex, activeMouse);
      backpack.deselectMouse();
    }
  }

  private clickClose = () => {
    const { cellZoom } = this.stores;
    const { rowIndex } = this.props;
    cellZoom.clearRowBackpackMouse(rowIndex);
  }
}
