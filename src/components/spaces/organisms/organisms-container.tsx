import { inject, observer } from "mobx-react";
import * as React from "react";
import { SizeMe } from "react-sizeme";
import { BaseComponent, IBaseProps } from "../../base";
import { ZoomControl } from "../../zoom-control";
import { OrganismView } from "./organism-view";
import { CollectButtonComponent } from "../../collect-button";

import "./organisms-container.sass";
import { ZoomLevelType, OrganismsRowModelType } from "../../../models/spaces/organisms/organisms-row";
import { OrganelleWrapper } from "./organelle-wrapper";

interface SizeMeProps {
  size?: {
    width: number | null;
    height: number | null;
  };
}

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
    const organismsRow = organisms.rows[rowIndex];
    const { organismsMouse, zoomLevel } = organismsRow;

    return (
      <div className="organism-view-container" data-test="organism-view-container">
        <CollectButtonComponent
          backpackMouse={organismsMouse && organismsMouse.backpackMouse}
          clickMouse={this.clickMouse}
          clickEmpty={this.clickEmpty}
          clickClose={this.clickClose}
        />
        <SizeMe monitorHeight={true}>
          {(sizeProps: SizeMeProps) => {
            return  this.organismZoomedView(organismsRow, zoomLevel, rowIndex, sizeProps);
          }}
        </SizeMe>
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

  // We explicitly pass down organismsRow and zoomLevel separately, or MST won't correctly attach the observers
  // due to this function being nested inside the SizeMe component.
  private organismZoomedView = (organismsRow: OrganismsRowModelType, zoomLevel: ZoomLevelType, rowIndex: number,
                                { size }: SizeMeProps) => {
    const { organismsMouse } = organismsRow;
    const width = size && size.width ? size.width : 0;

    switch (zoomLevel) {
      case "organism":
        return <OrganismView backpackMouse={organismsMouse && organismsMouse.backpackMouse} width={width}/>;
      case "cell":
        return (
          <div className="cell-zoom-panel" data-test="cell-zoon-panel">
            {
              organismsMouse != null &&
                <OrganelleWrapper elementName={`organelle-wrapper-${rowIndex}`} rowIndex={rowIndex} width={width}/>
            }
          </div>
        );
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
