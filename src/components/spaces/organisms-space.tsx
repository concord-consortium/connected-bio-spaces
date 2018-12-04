import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../base";
import { TwoUpDisplayComponent } from "../two-up-display";
import { FourUpDisplayComponent } from "../four-up-display";
import { Chart } from "../charts/chart";

import { OrganismsContainer } from "./organisms/organisms-container";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class OrganismsSpaceComponent extends BaseComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { topZoom: 1, bottomZoom: 0 };

  }
  public render() {
    const organismsComponent1 = this.getOrganismsRow(0);
    const organismsComponent2 = this.getOrganismsRow(1);

    return (
      <FourUpDisplayComponent topRow={organismsComponent1} bottomRow={organismsComponent2} />
    );
  }

  private getOrganismsRow(rowIndex: number) {
    const { organisms } = this.stores;
    const row = organisms.rows[rowIndex];
    const { currentData } = row;

    const graphTitle = "Graph";
    const graphPanel = <Chart title="Chart Test" chartData={currentData}
      chartType={"horizontalBar"} />;

    return (
      <TwoUpDisplayComponent
        leftTitle="Investigate: Cell"
        leftPanel={<OrganismsContainer rowIndex={rowIndex}/>}
        rightTitle={graphTitle}
        rightPanel={graphPanel}
      />
    );
  }

}
