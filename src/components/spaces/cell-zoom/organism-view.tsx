import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../../base";

import "./organism-view.sass";
import { ZoomControl } from "../../zoom-control";
import { OrganelleWrapper } from "./OrganelleWrapper";

const kDefaultMouseImage = "../../assets/mouse_beach.png";

interface IProps extends IBaseProps {
  viewNumber: number;
}
interface IState {
  zoomLevel: number;
}

@inject("stores")
@observer
export class OrganismView extends BaseComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { zoomLevel: 1};
  }

  public render() {
    const { zoomLevel } = this.state;
    const { viewNumber } = this.props;
    const { backpack } = this.stores;
    const mouseStyle = {
      backgroundImage: `url(${kDefaultMouseImage})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "contain",
      width: "256px",
      height: "256px"
    };
    if (backpack.collectedMice && backpack.collectedMice.length > 0) {
      const mouse = backpack.collectedMice[0];
      mouseStyle.backgroundImage = `url(${mouse.baseImage})`;
    }
    const organelleViewName = `organelle-wrapper${viewNumber}`;
    const organismView = zoomLevel === 0 ?
      <div className="organism-view" style={mouseStyle}>Mouse</div> :
      <OrganelleWrapper elementName={organelleViewName} rowIndex={viewNumber}/>;

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
}
