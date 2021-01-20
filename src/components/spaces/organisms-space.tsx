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
import { kOrganelleInfo } from "../../models/spaces/organisms/mouse/mouse-cell-data";
import { extractCodons } from "./proteins/util/dna-utils";
import { getAminoAcidsFromCodons } from "./proteins/util/amino-acid-utils";
import { CollectButtonComponent } from "../collect-button";
import ChromosomeViewer from "./organisms/chromosome-viewer";
import { OrganismsSpaceModelType } from "../../models/spaces/organisms/organisms-space";

interface IProps extends IBaseProps {}
interface IState {
  isZooming: boolean;
}

@inject("stores")
@observer
export class OrganismsSpaceComponent extends BaseComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      isZooming: false
    };
  }

  public render() {
    const { organisms } = this.stores;
    if (!organisms) return null;
    const organismsComponent1 = this.getOrganismsRow(0, organisms);
    const organismsComponent2 = this.getOrganismsRow(1, organisms);

    return (
      <FourUpDisplayComponent topRow={organismsComponent1} bottomRow={organismsComponent2} />
    );
  }

  private toggleShowingAminoAcidsOnViewer = (rowIndex: number, organisms: OrganismsSpaceModelType) => {
    const row = organisms.rows[rowIndex];
    return () =>
      row.setShowProteinAminoAcidsOnProtein(!row.showProteinAminoAcidsOnProtein);
  }

  private toggleShowDNA = (rowIndex: number, organisms: OrganismsSpaceModelType) => {
    const row = organisms.rows[rowIndex];
    return () =>
      row.setShowProteinDNA(!row.showProteinDNA);
  }

  private handleSetSelectStartPercent = (percent: number, organisms: OrganismsSpaceModelType) => {
    // set on both simultaneously
    return () => organisms.setProteinSliderStartPercent(percent);
  }

  private handleUpdateSelectedAminoAcidIndex = (organisms: OrganismsSpaceModelType) => {
    return (selectedAminoAcidIndex: number) =>
      organisms.setProteinSliderSelectedAminoAcidIndex(Math.round(selectedAminoAcidIndex));
  }

  private toggleShowInfoBox = (organisms: OrganismsSpaceModelType) => {
    return () => organisms.setShowInfoBox(!organisms.showProteinInfoBox);
  }

  private getOrganismsRow(rowIndex: number, organisms: OrganismsSpaceModelType) {
    const { backpack } = this.stores;
    const { activeMouse } = backpack;
    const { proteinSliderSelectedAminoAcidIndex, showProteinInfoBox } = organisms;
    const row = organisms.rows[rowIndex];
    const { organismsMouse } = row;
    const { currentData, selectedOrganelle,
      showProteinAminoAcidsOnProtein, showProteinDNA,
      rightPanel, selectedChromosome } = row;

    if (selectedOrganelle && kOrganelleInfo[selectedOrganelle].protein) {
      const otherRow = organisms.rows[rowIndex ? 0 : 1];
      if (otherRow.selectedOrganelle && kOrganelleInfo[otherRow.selectedOrganelle].protein) {
        const protein1 = kOrganelleInfo[selectedOrganelle].protein;
        const protein2 = kOrganelleInfo[otherRow.selectedOrganelle].protein;

        const codons1 = extractCodons(protein1!.dna);
        const codons2 = extractCodons(protein2!.dna);
        const aminoAcids1 = getAminoAcidsFromCodons(codons1);
        const aminoAcids2 = getAminoAcidsFromCodons(codons2);
      }
    }

    const zoomLevel = row.zoomLevel;

    const rightPanelContent = (() => {
      switch (rightPanel) {
        case "instructions":
          return <InstructionsComponent content={organisms.instructions}/>;
        case "data":
          return <Chart
            chartData={currentData}
            chartType={"horizontalBar"}
            isPlaying={false} />;
        case "information":
        default:
          if (zoomLevel === "receptor") {
            if (selectedOrganelle && kOrganelleInfo[selectedOrganelle].protein) {
              return <ProteinViewer
              protein={kOrganelleInfo[selectedOrganelle].protein!}
              selectedAminoAcidIndex={proteinSliderSelectedAminoAcidIndex}
              showInfoBox={showProteinInfoBox}
              showAminoAcidsOnProtein={showProteinAminoAcidsOnProtein}
              showDNA={showProteinDNA}
              toggleShowDNA={this.toggleShowDNA(rowIndex, organisms)}
              toggleShowingAminoAcidsOnProtein={this.toggleShowingAminoAcidsOnViewer(rowIndex, organisms)}
              setSelectedAminoAcidIndex={this.handleUpdateSelectedAminoAcidIndex(organisms)}
              toggleShowInfoBox={this.toggleShowInfoBox(organisms)}
            />;
            } else {
              return (
                <div>
                  Find and inspect a protein to view it here.
                </div>);
            }
          } else if (zoomLevel === "nucleus") {
            if (organismsMouse && selectedChromosome) {
              return <ChromosomeViewer
                genotype={organismsMouse.backpackMouse.genotype}
                chromosome={selectedChromosome}
                colored={row.nucleusColored}
              />;
            } else {
              return (
                <div>
                  Find and inspect a chromosome to view it here.
                </div>);
            }
          } else {
            return (
              <div>You'll need to zoom in deeper to find something to inspect</div>);
          }
      }
    })();

    const buttons = [];
    if (selectedOrganelle && kOrganelleInfo[selectedOrganelle].protein) {
      buttons.push({
        title: "DNA",
        type: "checkbox",
        value: row.showProteinDNA,
        action: (val: boolean) => row.setShowProteinDNA(val),
        section: "information"
      });

      buttons.push({
        title: "Amino acids on protein",
        type: "checkbox",
        value: row.showProteinAminoAcidsOnProtein,
        action: (val: boolean) => row.setShowProteinAminoAcidsOnProtein(val),
        section: "information"
      });
    }

    return (
      <div className="fullwidth">
        <CollectButtonComponent
          backpackMouse={organismsMouse && organismsMouse.backpackMouse}
          clickClose={this.clickClose(rowIndex, organisms)}
          placeable={activeMouse != null}
        />
        <TwoUpDisplayComponent
          leftTitle="Explore: Organism"
          leftPanel={<OrganismsContainer
            rowIndex={rowIndex}
            disableZoom={this.state.isZooming}
            notifyZooming={this.handleZooming} />}
          rightPanel={rightPanelContent}
          instructionsIconEnabled={true}
          dataIconEnabled={true}
          informationIconEnabled={true}
          selectedRightPanel={rightPanel}
          onClickRightIcon={this.setRightPanel(rowIndex, organisms)}
          spaceClass="organism"
          rowNumber={rowIndex}
          rightPanelButtons={buttons}
        />
      </div>
    );
  }

  private setRightPanel = (rowIndex: number, organisms: OrganismsSpaceModelType) => (panelType: RightPanelType) => {
    organisms.rows[rowIndex].setRightPanel(panelType);
  }

  private clickClose = (rowIndex: number, organisms: OrganismsSpaceModelType) => () => {
    organisms.clearRowBackpackMouse(rowIndex);
  }

  private handleZooming = (isZooming: boolean) => {
    this.setState({isZooming});
  }

}
