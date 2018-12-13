import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../base";
import { TwoUpDisplayComponent } from "../two-up-display";
import { FourUpDisplayComponent } from "../four-up-display";
import { Chart } from "../charts/chart";
import { InstructionsComponent } from "../instructions";

import { OrganismsContainer } from "./organisms/organisms-container";
import ProteinViewer from "./proteins/protein-viewer";
import { RightPanelType } from "../../models/ui";
import { kOrganelleInfo } from "../../models/spaces/organisms/organisms-space";

interface IProps extends IBaseProps {}
interface IState {}

@inject("stores")
@observer
export class OrganismsSpaceComponent extends BaseComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const organismsComponent1 = this.getOrganismsRow(0);
    const organismsComponent2 = this.getOrganismsRow(1);

    return (
      <FourUpDisplayComponent topRow={organismsComponent1} bottomRow={organismsComponent2} />
    );
  }

  private toggleShowingAminoAcidsOnViewer = (rowIndex: number) => {
    const { organisms } = this.stores;
    const row = organisms.rows[rowIndex];
    return () =>
      row.setShowProteinAminoAcidsOnProtein(!row.showProteinAminoAcidsOnProtein);
  }

  private toggleShowDNA = (rowIndex: number) => {
    const { organisms } = this.stores;
    const row = organisms.rows[rowIndex];
    return () =>
      row.setShowProteinDNA(!row.showProteinDNA);
  }

  private handleSetSelectStartPercent = (percent: number) => {
    const { organisms } = this.stores;
    // set on both simultaneously
    organisms.rows[0].setProteinSliderStartPercent(percent);
    organisms.rows[1].setProteinSliderStartPercent(percent);
  }

  private getOrganismsRow(rowIndex: number) {
    const { organisms } = this.stores;
    const row = organisms.rows[rowIndex];
    const { currentData, selectedOrganelle,
      showProteinAminoAcidsOnProtein, showProteinDNA, proteinSliderStartPercent,
      rightPanel } = row;

    const rightPanelContent = (() => {
      switch (rightPanel) {
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
              selectionStartPercent={proteinSliderStartPercent}
              showAminoAcidsOnProtein={showProteinAminoAcidsOnProtein}
              showDNA={showProteinDNA}
              dnaSwitchable={true}
              toggleShowDNA={this.toggleShowDNA(rowIndex)}
              toggleShowingAminoAcidsOnProtein={this.toggleShowingAminoAcidsOnViewer(rowIndex)}
              setSelectStartPercent={this.handleSetSelectStartPercent}
            />;
          } else {
            return (
              <div>
                Find and inspect a protein to view it here.
              </div>);
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
        selectedRightPanel={rightPanel}
        onClickRightIcon={this.setRightPanel(rowIndex)}
        spaceClass="organism"
        rowNumber={rowIndex}
      />
    );
  }

  private setRightPanel = (rowIndex: number) => (panelType: RightPanelType) => {
    const { organisms } = this.stores;
    organisms.rows[rowIndex].setRightPanel(panelType);
  }

}
