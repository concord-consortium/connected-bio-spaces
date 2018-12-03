import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../base";
import { TwoUpDisplayComponent } from "../two-up-display";
import { FourUpDisplayComponent } from "../four-up-display";
import { Chart } from "../charts/chart";

import { OrganismContainer } from "./cell-zoom/organism-container";

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
    const cellZoomComponent1 = this.getCellZoomRow(0);
    const cellZoomComponent2 = this.getCellZoomRow(1);

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
        leftPanel={<OrganismContainer rowIndex={rowIndex}/>}
        rightTitle={graphTitle}
        rightPanel={graphPanel}
      />
    );
  }

}
