import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../../base";

import "./organism-view.sass";
import { ZoomControl } from "../../zoom-control";
import { OrganelleWrapper } from "./OrganelleWrapper";
import { OrganismView } from "./organism-view";

interface IProps extends IBaseProps {
  viewNumber: number;
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
    const organismView = this.organismZoomedView();

    return (
      <div className="organism-view-container" data-test="organism-view-container">
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
    const { viewNumber } = this.props;

    switch (zoomLevel) {
      case 0:
        return <OrganismView rowIndex={viewNumber} />;
      case 1:
        const organelleViewName = `organelle-wrapper${viewNumber}`;
        return <OrganelleWrapper elementName={organelleViewName} rowIndex={viewNumber} />;
      default:
        break;
    }
  }
}
