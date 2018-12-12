import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../base";
import { TwoUpDisplayComponent } from "../two-up-display";
import { FourUpDisplayComponent } from "../four-up-display";
import { Chart } from "../charts/chart";
import { InstructionsComponent } from "../instructions";

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
    const { ui, organisms } = this.stores;
    const row = organisms.rows[rowIndex];
    const { currentData } = row;
    const showOrganismGraph = ui.showOrganismGraph[rowIndex];
    const iconId = showOrganismGraph ? "#icon-show-data" : "#icon-show-graph";
    const graphTitle = showOrganismGraph ? "Data" : "Instructions";
    const graphPanel = <Chart title="Chart Test" chartData={currentData}
      chartType={"horizontalBar"} isPlaying={false} />;
    const instructionsPanel = <InstructionsComponent content={organisms.instructions}/>;
    const rightPanelContent = showOrganismGraph ? graphPanel : instructionsPanel;

    return (
      <TwoUpDisplayComponent
        leftTitle="Explore: Organism"
        leftPanel={<OrganismsContainer rowIndex={rowIndex}/>}
        rightTitle={graphTitle}
        rightIcon={iconId}
        rightPanel={rightPanelContent}
        onClickRightIcon={this.toggleOrganismsGraph(rowIndex)}
        spaceClass="organism"
      />
    );
  }

  private toggleOrganismsGraph = (rowIndex: number) => (e: any) => {
    const {ui} = this.stores;
    ui.setShowOrganismGraph(rowIndex, !ui.showOrganismGraph[rowIndex]);
  }

}
