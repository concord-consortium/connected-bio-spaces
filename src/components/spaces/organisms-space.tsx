import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../base";
import { TwoUpDisplayComponent } from "../two-up-display";
import { FourUpDisplayComponent } from "../four-up-display";
import { Chart } from "../charts/chart";
import { InstructionsComponent } from "../instructions";

import { OrganismsContainer } from "./organisms/organisms-container";
import ProteinViewer from "./proteins/protein-viewer";
import MouseProteins from "./proteins/protein-specs/mouse-proteins";
import { RightPanelType } from "../../models/ui";
import { kOrganelleInfo } from "../../models/spaces/organisms/organisms-space";

interface IProps extends IBaseProps {}
interface IState {
  showAminoAcidsOnViewer: boolean;
  showDNA: boolean;
}

@inject("stores")
@observer
export class OrganismsSpaceComponent extends BaseComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      showAminoAcidsOnViewer: false,
      showDNA: false
    };
  }

  public render() {
    const organismsComponent1 = this.getOrganismsRow(0);
    const organismsComponent2 = this.getOrganismsRow(1);

    return (
      <FourUpDisplayComponent topRow={organismsComponent1} bottomRow={organismsComponent2} />
    );
  }

  private toggleShowingAminoAcidsOnViewer = () => {
    this.setState({
      showAminoAcidsOnViewer: !this.state.showAminoAcidsOnViewer
    });
  }

  private toggleShowDNA = () => {
    this.setState({
      showDNA: !this.state.showDNA
    });
  }

  private getOrganismsRow(rowIndex: number) {
    const { ui, organisms } = this.stores;
    const row = organisms.rows[rowIndex];
    const { currentData, selectedOrganelle } = row;
    const rightPanelType = ui.organismRightPanel[rowIndex];

    const rightPanelContent = (() => {
      switch (rightPanelType) {
        case "instructions":
          return <InstructionsComponent content={organisms.instructions}/>;
        case "data":
          return <Chart
            title="Chart Test"
            chartData={currentData}
            chartType={"horizontalBar"}
            isPlaying={false} />;
        case "information":
        default:
          if (selectedOrganelle && kOrganelleInfo[selectedOrganelle].protein) {
            return <ProteinViewer
              protein={kOrganelleInfo[selectedOrganelle].protein}
              showAminoAcidsOnProtein={this.state.showAminoAcidsOnViewer}
              showDNA={this.state.showDNA}
              dnaSwitchable={true}
              toggleShowDNA={this.toggleShowDNA}
              toggleShowingAminoAcidsOnProtein={this.toggleShowingAminoAcidsOnViewer}
            />;
          } else {
            return null;
          }
      }
    })();

    return (
      <TwoUpDisplayComponent
        leftTitle="Explore: Organism"
        leftPanel={<OrganismsContainer rowIndex={rowIndex}/>}
        rightPanel={rightPanelContent}
        instructionsIconEnabled={true}
        dataIconEnabled={true}
        informationIconEnabled={true}
        selectedRightPanel={rightPanelType}
        onClickRightIcon={this.toggleOrganismsGraph(rowIndex)}
        spaceClass="organism"
      />
    );
  }

  private toggleOrganismsGraph = (rowIndex: number) => (panelType: RightPanelType) => {
    const {ui} = this.stores;
    ui.setOrganismRightPanel(rowIndex, panelType);
  }

}
