import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../base";
import { TwoUpDisplayComponent } from "../two-up-display";
import { FourUpDisplayComponent } from "../four-up-display";
import { Chart } from "../charts/chart";

import { CellZoomComponent } from "./cell-zoom/cell-zoom";
import { OrganismView } from "./cell-zoom/organism-view";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class CellZoomSpaceComponent extends BaseComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { topZoom: 1, bottomZoom: 0 };

  }
  public render() {
    const _cellZoomComponent1 = this.getCellZoomRow(0);
    const _cellZoomComponent2 = this.getCellZoomRow(1);

    const { cellZoom } = this.stores;
    const graphTitle = "Graph";

    const cellGraphPanel1 = <Chart title="Chart Test" chartData={cellZoom.rows[0].currentData}
      chartType={"horizontalBar"} />;
    const cellZoomComponent1 = <TwoUpDisplayComponent
      leftTitle="Investigate: Cell"
      leftPanel={<OrganismView viewNumber={0} />}
      rightTitle={graphTitle}
      rightPanel={cellGraphPanel1}
    />;

    const cellGraphPanel2 = <Chart title="Chart Test" chartData={cellZoom.rows[1].currentData}
      chartType={"horizontalBar"} />;
    const cellZoomComponent2 = <TwoUpDisplayComponent
      leftTitle="Investigate: Cell"
      leftPanel={<OrganismView viewNumber={1} />}
      rightTitle={graphTitle}
      rightPanel={cellGraphPanel2}
    />;
    return (
      <FourUpDisplayComponent topRow={cellZoomComponent1} bottomRow={cellZoomComponent2} />
    );
  }

  private getCellZoomRow(rowIndex: number) {
    const { cellZoom } = this.stores;
    const row = cellZoom.rows[rowIndex];
    const { currentData } = row;

    const graphTitle = "Graph";
    const graphPanel = <Chart title="Chart Test" chartData={currentData}
      chartType={"horizontalBar"} />;

    return (
      <TwoUpDisplayComponent
        leftTitle="Investigate: Cell"
        leftPanel={<CellZoomComponent rowIndex={rowIndex}/>}
        rightTitle={graphTitle}
        rightPanel={graphPanel}
      />
    );
  }

}
