import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../../base";
import { ZoomControl } from "../../zoom-control";
import { OrganismView } from "./organism-view";
import { CollectButtonComponent } from "../../collect-button";
import { CellZoomComponent } from "../cell-zoom/cell-zoom";

import "./organism-container.sass";
import { ZoomLevel, ZoomLevelType } from "../../../models/spaces/cell-zoom/cell-zoom-row";
interface IProps extends IBaseProps {
  rowIndex: number;
}
interface IState { }

@inject("stores")
@observer
export class OrganismContainer extends BaseComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { zoomLevel: 1 };
  }

  public render() {
    const { rowIndex } = this.props;
    const { cellZoom } = this.stores;
    const { cellMouse } = cellZoom.rows[rowIndex];
    const organismView = this.organismZoomedView();

    return (
      <div className="organism-view-container" data-test="organism-view-container">
        <CollectButtonComponent
          backpackMouse={cellMouse && cellMouse.backpackMouse}
          clickMouse={this.clickMouse}
          clickEmpty={this.clickEmpty}
          clickClose={this.clickClose}
        />
        {organismView}
        <ZoomControl handleZoom={this.zoomChange} />
      </div>
    );
  }

  private zoomChange = (zoomChange: number) => {
    const { cellZoom } = this.stores;
    const { rowIndex } = this.props;
    const cellZoomRow = cellZoom.rows[rowIndex];

    // Add protein level to this list when ready
    const availableZoomLevels: ZoomLevelType[] = ["organism", "cell"];
    const maxZoom = availableZoomLevels.length - 1;

    const current = availableZoomLevels.indexOf(cellZoomRow.zoomLevel);
    const newZoom = current + zoomChange;
    const nextIdx = newZoom > maxZoom ? maxZoom : newZoom < 0 ? 0 : newZoom;

    cellZoomRow.setZoomLevel(availableZoomLevels[nextIdx]);
  }

  private organismZoomedView = () => {
    const { rowIndex } = this.props;
    const { cellZoom } = this.stores;
    const cellZoomRow = cellZoom.rows[rowIndex];
    const { cellMouse } = cellZoom.rows[rowIndex];

    switch (cellZoomRow.zoomLevel) {
      case "organism":
        return <OrganismView backpackMouse={cellMouse && cellMouse.backpackMouse} />;
      case "cell":
        return <CellZoomComponent rowIndex={rowIndex} />;
      default:
        break;
    }
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
