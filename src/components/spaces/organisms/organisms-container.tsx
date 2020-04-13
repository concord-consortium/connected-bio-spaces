import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../../base";
import { ZoomControl } from "../../zoom-control";
import { OrganismView } from "./organism-view";

import "./organisms-container.sass";
import { ZoomLevelType, OrganismsRowModelType, ModeType } from "../../../models/spaces/organisms/organisms-row";
import { OrganelleWrapper } from "./organelle-wrapper";
import { ManipulationControls } from "./manipulation-controls";
import { NucleusView } from "./nucleus-view";
import { DEFAULT_MODEL_WIDTH } from "../../..";

interface IProps extends IBaseProps {
  rowIndex: number;
  disableZoom: boolean;
  notifyZooming: (isZooming: boolean) => void;
}
interface IState {
  zoomLevel: number;
  isZoomingIntoOrg: boolean;
  cellModelLoaded: boolean;
  nucleusAnimating: boolean;
}

@inject("stores")
@observer
export class OrganismsContainer extends BaseComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      zoomLevel: 1,
      isZoomingIntoOrg: false,
      cellModelLoaded: false,
      nucleusAnimating: false
    };
  }

  public render() {
    const { rowIndex } = this.props;
    const { organisms } = this.stores;
    const organismsRow = organisms.rows[rowIndex];
    const { zoomLevel, mode } = organismsRow;
    const showTargetZoom = zoomLevel === "cell";

    return (
      <div className="organisms-container" data-test="organism-view-container">
        {
          this.organismZoomedView(organismsRow, zoomLevel, rowIndex, mode)
        }
        <div className="organism-controls">
          <ZoomControl handleZoom={this.zoomChange} rowIndex={rowIndex} showTargetZoom={showTargetZoom}
            disable={this.props.disableZoom} />
          <ManipulationControls rowIndex={rowIndex} disableNucleusControls={this.state.nucleusAnimating} />
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

    const current: number = availableZoomLevels[organismsRow.zoomLevel];
    const newZoom = current + zoomChange;
    const nextIdx = newZoom > maxZoom ? maxZoom : newZoom < 0 ? 0 : newZoom;

    const zoomLevel = defaultZoomLevelByIndex[nextIdx];

    if (zoomLevel !== "cell") {
      this.setState({
        isZoomingIntoOrg: false,
        cellModelLoaded: false
      });
      this.props.notifyZooming(false);
    } else if (zoomLevel === "cell" && current === 0) {
      this.setState({isZoomingIntoOrg: true});
      this.props.notifyZooming(true);
    }
    organismsRow.setZoomLevel(defaultZoomLevelByIndex[nextIdx]);
  }

  private zoomToLevel = (level: ZoomLevelType) => {
    const { organisms } = this.stores;
    const { rowIndex } = this.props;
    const organismsRow = organisms.rows[rowIndex];
    organismsRow.setZoomLevel(level);
  }

  // We explicitly pass down organismsRow and zoomLevel separately
  private organismZoomedView = (organismsRow: OrganismsRowModelType, zoomLevel: ZoomLevelType, rowIndex: number,
                                mode: ModeType) => {
    const { organismsMouse, previousZoomLevel } = organismsRow;
    const width = DEFAULT_MODEL_WIDTH;
    const { isZoomingIntoOrg, cellModelLoaded } = this.state;
    const cellClassName = `cell-zoom-panel`;

    return (
      <div className="organism-stacker">
        {
          (zoomLevel === "organism" || isZoomingIntoOrg ||
            (previousZoomLevel as unknown as string === "organism" && !cellModelLoaded)) &&
          <OrganismView
            backpackMouse={organismsMouse && organismsMouse.backpackMouse}
            zoomIn={isZoomingIntoOrg}
            onZoomInComplete={this.handleOrgZoomInComplete}/>
        }
        {
          (!isZoomingIntoOrg && (zoomLevel === "cell" || zoomLevel === "receptor")) &&
          <div className={cellClassName} key={zoomLevel} data-test="cell-zoon-panel">
            {
              organismsMouse != null &&
                <OrganelleWrapper zoomLevel={zoomLevel} elementName={`organelle-wrapper-${rowIndex}`}
                  rowIndex={rowIndex} width={width} mode={mode} handleZoomToLevel={this.zoomToLevel}
                  onModelLoaded={this.cellModelLoaded}/>
            }
          </div>
        }
        {
          (zoomLevel === "nucleus") &&
          <div className={"cell-zoom-panel " + mode} key={zoomLevel} data-test="cell-zoom-panel">
            <NucleusView rowIndex={rowIndex} width={width} onNucleusAnimating={this.handleNucleusAnimating} />
          </div>
        }
      </div>
    );
  }

  private handleOrgZoomInComplete = () => {
    this.setState({isZoomingIntoOrg: false});
    this.props.notifyZooming(false);
  }

  private cellModelLoaded = () => {
    this.setState({cellModelLoaded: true});
  }

  private handleNucleusAnimating = (animating: boolean) => {
    this.setState({nucleusAnimating: animating});
  }
}
