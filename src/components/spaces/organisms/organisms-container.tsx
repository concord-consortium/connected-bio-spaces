import { inject, observer } from "mobx-react";
import * as React from "react";
import { SizeMe } from "react-sizeme";
import { BaseComponent, IBaseProps } from "../../base";
import { ZoomControl } from "../../zoom-control";
import { OrganismView } from "./organism-view";

import "./organisms-container.sass";
import { ZoomLevelType, OrganismsRowModelType, ModeType } from "../../../models/spaces/organisms/organisms-row";
import { OrganelleWrapper } from "./organelle-wrapper";
import { ManipulationControls } from "./manipulation-controls";
import { StaticNucleusView } from "./static-nucleus-view";

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
    const { zoomLevel, mode } = organismsRow;
    const showTargetZoom = zoomLevel === "cell";

    return (
      <div className="organisms-container" data-test="organism-view-container">
        <SizeMe monitorHeight={true}>
          {(sizeProps: SizeMeProps) => {
            return  this.organismZoomedView(organismsRow, zoomLevel, rowIndex, mode, sizeProps);
          }}
        </SizeMe>
        <div className="organism-controls">
          <ZoomControl handleZoom={this.zoomChange} rowIndex={rowIndex} showTargetZoom={showTargetZoom} />
          <ManipulationControls rowIndex={rowIndex} />
        </div>
      </div>
    );
  }

  private zoomChange = (zoomChange: number) => {
    const { organisms } = this.stores;
    const { rowIndex } = this.props;
    const organismsRow = organisms.rows[rowIndex];

    const availableZoomLevels: {[key in ZoomLevelType]: number} = {
      organism: 0,
      cell: 1,
      receptor: 2,
      nucleus: 2
    };
    const maxZoom = 2;
    const defaultZoomLevelByIndex: ZoomLevelType[] = ["organism", "cell", "receptor"];

    const current = availableZoomLevels[organismsRow.zoomLevel];
    const newZoom = current + zoomChange;
    const nextIdx = newZoom > maxZoom ? maxZoom : newZoom < 0 ? 0 : newZoom;

    organismsRow.setZoomLevel(defaultZoomLevelByIndex[nextIdx]);
  }

  private zoomToLevel = (level: ZoomLevelType) => {
    const { organisms } = this.stores;
    const { rowIndex } = this.props;
    const organismsRow = organisms.rows[rowIndex];
    organismsRow.setZoomLevel(level);
  }

  // We explicitly pass down organismsRow and zoomLevel separately, or MST won't correctly attach the observers
  // due to this function being nested inside the SizeMe component.
  private organismZoomedView = (organismsRow: OrganismsRowModelType, zoomLevel: ZoomLevelType, rowIndex: number,
                                mode: ModeType, { size }: SizeMeProps) => {
    const { organismsMouse } = organismsRow;
    const width = size && size.width ? size.width : 0;

    switch (zoomLevel) {
      case "organism":
        return <OrganismView backpackMouse={organismsMouse && organismsMouse.backpackMouse} width={width}/>;
      case "cell":
      case "receptor":
        return (
          <div className="cell-zoom-panel" key={zoomLevel} data-test="cell-zoon-panel">
            {
              organismsMouse != null &&
                <OrganelleWrapper zoomLevel={zoomLevel} elementName={`organelle-wrapper-${rowIndex}`}
                  rowIndex={rowIndex} width={width} mode={mode} handleZoomToLevel={this.zoomToLevel}/>
            }
          </div>
        );
      case "nucleus":
        return (
          <div className="cell-zoom-panel" key={zoomLevel} data-test="cell-zoon-panel">
            <StaticNucleusView rowIndex={rowIndex} width={width}/>
          </div>
        );
      default:
        break;
    }
  }

}
