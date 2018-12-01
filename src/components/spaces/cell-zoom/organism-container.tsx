import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../../base";
import { ZoomControl } from "../../zoom-control";
import { OrganismView } from "./organism-view";
import { CollectButtonComponent } from "../../collect-button";
import { CellZoomComponent } from "../cell-zoom/cell-zoom";

import "./organism-container.sass";
interface IProps extends IBaseProps {
  rowIndex: number;
}
interface IState {
  zoomLevel: number;
}

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
    const { zoomLevel } = this.state;
    const newZoom = zoomLevel + zoomChange;
    const nextZoom = newZoom > 1 ? 1 : newZoom < 0 ? 0 : newZoom;
    this.setState({ zoomLevel: nextZoom });
  }

  private organismZoomedView = () => {
    const { zoomLevel } = this.state;
    const { rowIndex } = this.props;

    switch (zoomLevel) {
      case 0:
        return <OrganismView rowIndex={rowIndex} />;
      case 1:
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
