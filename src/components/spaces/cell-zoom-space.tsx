import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../base";
import { TwoUpDisplayComponent } from "../two-up-display";
import { FourUpDisplayComponent } from "../four-up-display";
import OrganelleWrapper from "./cell-zoom/OrganelleWrapper";
import { Chart } from "../charts/chart";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class CellZoomSpaceComponent extends BaseComponent<IProps, IState> {

  public render() {
    const {cellZoom} = this.stores;
    const graphTitle = "Graph";

    const cellGraphPanel1 = <Chart title="Chart Test" chartData={cellZoom.currentData} chartType={"horizontalBar"} />;
    const cellZoomComponent1 = <TwoUpDisplayComponent
      leftTitle="Investigate: Cell"
      leftPanel={<OrganelleWrapper elementName="organelle-wrapper-1" />}
      rightTitle={graphTitle}
      rightPanel={cellGraphPanel1}
    />;

    const cellGraphPanel2 = <Chart title="Chart Test" chartData={cellZoom.currentData} chartType={"horizontalBar"} />;
    const cellZoomComponent2 = <TwoUpDisplayComponent
      leftTitle="Investigate: Cell"
      leftPanel={<OrganelleWrapper elementName="organelle-wrapper-2" />}
      rightTitle={graphTitle}
      rightPanel={cellGraphPanel2}
    />;
    return (
      <FourUpDisplayComponent topRow={cellZoomComponent1} bottomRow={cellZoomComponent2} />
    );
  }

}
