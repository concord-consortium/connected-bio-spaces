import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../../base";
import { ZoomControl } from "../../zoom-control";
import { OrganismView } from "./organism-view";
import { CollectButtonComponent } from "../../collect-button";
import { CellZoomComponent } from "./cell-view";

import "./organisms-container.sass";
import { ZoomLevel, ZoomLevelType } from "../../../models/spaces/organisms/organisms-row";
interface IProps extends IBaseProps {
  rowIndex: number;
}
interface IState { }

@inject("stores")
@observer
export class OrganismsContainer extends BaseComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { zoomLevel: 1 };
  }

  public render() {
    const { rowIndex } = this.props;
    const { organisms } = this.stores;
    const { organismsMouse } = organisms.rows[rowIndex];
    const organismView = this.organismZoomedView();

    return (
      <div className="organism-view-container" data-test="organism-view-container">
        <CollectButtonComponent
          backpackMouse={organismsMouse && organismsMouse.backpackMouse}
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
    const { organisms } = this.stores;
    const { rowIndex } = this.props;
    const organismsRow = organisms.rows[rowIndex];

    // Add protein level to this list when ready
    const availableZoomLevels: ZoomLevelType[] = ["organism", "cell"];
    const maxZoom = availableZoomLevels.length - 1;

    const current = availableZoomLevels.indexOf(organismsRow.zoomLevel);
    const newZoom = current + zoomChange;
    const nextIdx = newZoom > maxZoom ? maxZoom : newZoom < 0 ? 0 : newZoom;

    organismsRow.setZoomLevel(availableZoomLevels[nextIdx]);
  }

  private organismZoomedView = () => {
    const { rowIndex } = this.props;
    const { organisms } = this.stores;
    const organismsRow = organisms.rows[rowIndex];
    const { organismsMouse } = organisms.rows[rowIndex];

    switch (organismsRow.zoomLevel) {
      case "organism":
        return <OrganismView backpackMouse={organismsMouse && organismsMouse.backpackMouse} />;
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
    const { backpack, organisms } = this.stores;
    const { rowIndex } = this.props;
    const { activeMouse } = backpack;
    if (activeMouse != null) {
      organisms.setRowBackpackMouse(rowIndex, activeMouse);
      backpack.deselectMouse();
    }
  }

  private clickClose = () => {
    const { organisms } = this.stores;
    const { rowIndex } = this.props;
    organisms.clearRowBackpackMouse(rowIndex);
  }
}
