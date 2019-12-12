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
import { extractCodons } from "./proteins/util/dna-utils";
import { getAminoAcidsFromCodons } from "./proteins/util/amino-acid-utils";
import { CollectButtonComponent } from "../collect-button";
import ChromosomeViewer from "./organisms/chromosome-viewer";

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
    organisms.setProteinSliderStartPercent(percent);
  }

  private handleUpdateSelectedAminoAcidIndex = (selectedAminoAcidIndex: number) => {
    const { organisms } = this.stores;
    organisms.setProteinSliderSelectedAminoAcidIndex(Math.round(selectedAminoAcidIndex));
  }

  private toggleShowInfoBox = () => {
    const { organisms } = this.stores;
    organisms.setShowInfoBox(!organisms.showProteinInfoBox);
  }

  private getOrganismsRow(rowIndex: number) {
    const { backpack, organisms } = this.stores;
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
            title="Chart Test"
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
              toggleShowDNA={this.toggleShowDNA(rowIndex)}
              toggleShowingAminoAcidsOnProtein={this.toggleShowingAminoAcidsOnViewer(rowIndex)}
              setSelectedAminoAcidIndex={this.handleUpdateSelectedAminoAcidIndex}
              toggleShowInfoBox={this.toggleShowInfoBox}
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
        title: "Amino Acids on Protein",
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
          clickClose={this.clickClose(rowIndex)}
          placeable={activeMouse != null}
        />
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
          rightPanelButtons={buttons}
        />
      </div>
    );
  }

  private setRightPanel = (rowIndex: number) => (panelType: RightPanelType) => {
    const { organisms } = this.stores;
    organisms.rows[rowIndex].setRightPanel(panelType);
  }

  private clickClose = (rowIndex: number) => () => {
    const { organisms } = this.stores;
    organisms.clearRowBackpackMouse(rowIndex);
  }

}
