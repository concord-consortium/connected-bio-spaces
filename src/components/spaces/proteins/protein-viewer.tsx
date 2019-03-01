import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../../base";
import { withSize } from "react-sizeme";
import AminoAcidSlider, { kSliderHeight } from "./amino-acid-slider";
import Protein from "./protein";
import InfoBox from "./info-box";
import { extractCodons } from "./util/dna-utils";
import { getAminoAcidsFromCodons } from "./util/amino-acid-utils";
import "./protein-viewer.sass";
import { PANEL_ASPECT_RATIO } from "../../four-up-display";

export interface ProteinSpec {
  dna: string;
  svgImage: string;
}

interface IProps extends IBaseProps {
  protein: ProteinSpec;
  secondProtein?: ProteinSpec;
  selectionStartPercent?: number;
  selectedAminoAcidIndex: number;
  selectedAminoAcidXLocation: number;
  showInfoBox: boolean;
  infoBoxAlert: boolean;
  aminoAcidWidth?: number;            // Width of one amino acid in the slider elements, in pixels
  codonWidth?: number;                // Width of one codon in the slider elements, in pixels
  showDNA?: boolean;
  showAminoAcidsOnProtein?: boolean;
  dnaSwitchable?: boolean;
  toggleShowDNA: () => void;
  toggleShowingAminoAcidsOnProtein: () => void;
  setSelectStartPercent: (percent: number) => void;
  setSelectedAminoAcidIndex: (selectedAminoAcidIndex: number, selectedAminoAcidXLocation: number) => void;
  toggleShowInfoBox: () => void;
  size: {width: number};              // From SizeMe
}

interface DefaultProps {
  selectionStartPercent: number;
  selectedAminoAcidIndex: number;
  selectedAminoAcidXLocation: number;
  showInfoBox: boolean;
  infoBoxAlert: boolean;
  aminoAcidWidth: number;
  codonWidth: number;
  showDNA: boolean;
  showAminoAcidsOnProtein: boolean;
  dnaSwitchable: boolean;
}

type PropsWithDefaults = IProps & DefaultProps;

interface IState {
  animating: boolean;
  selectionStartPercentTarget: number;
  marks: number[];
}

@inject("stores")
@observer
export class ProteinViewer extends BaseComponent<IProps, IState> {

  public static defaultProps: DefaultProps = {
    selectionStartPercent: 0,
    selectedAminoAcidIndex: 0,
    selectedAminoAcidXLocation: 0,
    showInfoBox: false,
    infoBoxAlert: false,
    aminoAcidWidth: 14,
    codonWidth: 29,
    showDNA: false,
    showAminoAcidsOnProtein: false,
    dnaSwitchable: true
  };

  constructor(props: IProps) {
    super(props);

    this.state = {
      animating: false,
      selectionStartPercentTarget: 0,
      marks: []
    };
  }

  public render() {
    const {
      protein, aminoAcidWidth,
      secondProtein, showDNA, showAminoAcidsOnProtein, dnaSwitchable,
      selectionStartPercent, selectedAminoAcidIndex, selectedAminoAcidXLocation,
      showInfoBox, infoBoxAlert
    } = this.props as PropsWithDefaults;

    const { width } = this.props.size;

    const height = width / PANEL_ASPECT_RATIO;

    const codons = extractCodons(protein.dna);
    const aminoAcids = getAminoAcidsFromCodons(codons);

    const halfWidth = width / 2;
    const selectionWidth = halfWidth / 4;

    const protein1SelectionPercent =  selectionWidth / (aminoAcids.length * aminoAcidWidth);
    let codons2;
    let aminoAcids2 = "";
    let protein2SelectionPercent = 0;
    if (secondProtein) {
      codons2 = extractCodons(secondProtein.dna);
      aminoAcids2 = getAminoAcidsFromCodons(codons2);
      protein2SelectionPercent = selectionWidth / (aminoAcids2.length * aminoAcidWidth);
    }

    const infoOptionsClass = "info-and-options" + (infoBoxAlert ? " alert" : "");

    return (
      <div className="protein-viewer">
        <div className="proteins-and-sliders">
          <div className="proteins">
            <Protein
              width={halfWidth}
              height={height - kSliderHeight}
              selectionStartPercent={selectionStartPercent}
              updateSelectionStart={this.handleAnimateToSelectionStart}
              selectionPercent={protein1SelectionPercent}
              viewBox="0 0 254 222"
              svg={protein.svgImage}
              marks={this.state.marks.map(loc => (loc + 0.5) / aminoAcids.length)}
              aminoAcids={aminoAcids}
              showAminoAcids={showAminoAcidsOnProtein}
            />
            { secondProtein
                ? <Protein
                    width={width / 2}
                    height={height - kSliderHeight}
                    selectionStartPercent={selectionStartPercent}
                    updateSelectionStart={this.handleAnimateToSelectionStart}
                    selectionPercent={protein2SelectionPercent}
                    viewBox="0 0 222 206"
                    highlightColor="4, 255, 0"
                    svg={secondProtein.svgImage}
                    marks={this.state.marks.map(loc => (loc + 0.5) / aminoAcids2.length)}
                    aminoAcids={aminoAcids}
                    showAminoAcids={showAminoAcidsOnProtein}
                  />
                : null
            }
          </div>
          <div className="amino-acids">
            <AminoAcidSlider
              aminoAcids={aminoAcids}
              codons={codons}
              width={halfWidth}
              aminoAcidWidth={aminoAcidWidth}
              selectionWidth={selectionWidth}
              selectionStartPercent={selectionStartPercent}
              updateSelectionStart={this.handleUpdateSelectionStart}
              animateToSelectionStart={this.handleAnimateToSelectionStart}
              selectedAminoAcidIndex={selectedAminoAcidIndex}
              onAminoAcidClick={this.handleAminoAcidClick}
              updateSelectedAminoAcidIndex={this.handleUpdateSelectedAminoAcidIndex}
              onClick={this.handleAminoAcidSliderClick}
              marks={this.state.marks}
              showDNA={showDNA}
              dimUnselected={showInfoBox}
            />
            {
              aminoAcids2 &&
              <AminoAcidSlider
                aminoAcids={aminoAcids2}
                codons={codons2}
                width={halfWidth}
                aminoAcidWidth={aminoAcidWidth}
                selectionWidth={selectionWidth}
                selectionStartPercent={selectionStartPercent}
                updateSelectionStart={this.handleUpdateSelectionStart}
                animateToSelectionStart={this.handleAnimateToSelectionStart}
                selectedAminoAcidIndex={selectedAminoAcidIndex}
                onAminoAcidClick={this.handleAminoAcidClick}
                updateSelectedAminoAcidIndex={this.handleUpdateSelectedAminoAcidIndex}
                onClick={this.handleAminoAcidSliderClick}
                marks={this.state.marks}
                dimUnselected={showInfoBox}
                showDNA={showDNA}
                highlightColor="4, 255, 0"
              />
            }
          </div>
        </div>
        <div className={infoOptionsClass}>
          {showInfoBox &&
            <InfoBox
              aminoAcids={aminoAcids}
              secondAminoAcids={aminoAcids2}
              selection={selectedAminoAcidIndex}
              selectedAminoAcidXLocation={selectedAminoAcidXLocation}
              marks={this.state.marks}
              onMarkLocation={this.handleMark}
              width={width - 26}
            />
          }
          <div className="options">
            {
              dnaSwitchable &&
              <label>
                <input
                  name="showDNA"
                  type="checkbox"
                  checked={showDNA}
                  onChange={this.handleDNAToggle} />
                Show DNA
              </label>
            }
            <label>
              <input
                name="showAminoAcidsOnProtein"
                type="checkbox"
                checked={showAminoAcidsOnProtein}
                onChange={this.handleAminoAcidsToggle} />
              Show Amino Acids on Protein
            </label>
          </div>
        </div>
      </div>
    );
  }

  private handleUpdateSelectionStart = (selectionStartPercent: number) => {
    this.setState({
      animating: false
    });
    this.props.setSelectStartPercent(selectionStartPercent);
  }

  private handleAnimateToSelectionStart = (selectionStartPercentTarget: number) => {
    this.setState({
      animating: true,
      selectionStartPercentTarget
    }, this.animate);
  }

  private animate = (fast?: boolean) => {
    const { selectionStartPercent } = this.props as PropsWithDefaults;
    const { selectionStartPercentTarget, animating } = this.state;
    if (!animating) return;

    let speed;

    // if the initial request is far away, keep fast for all frames. Otherwise go slow.
    if (!fast) {
      if (Math.abs(selectionStartPercentTarget - selectionStartPercent) > 0.035) {
        fast = true;
      }
    }

    const maxSpeed = fast ? 0.02 : 0.001;
    if (selectionStartPercent > selectionStartPercentTarget) {
      speed = Math.max(-maxSpeed, selectionStartPercentTarget - selectionStartPercent);
    } else {
      speed = Math.min(maxSpeed, selectionStartPercentTarget - selectionStartPercent);
    }
    this.props.setSelectStartPercent(selectionStartPercent + speed);
    if (selectionStartPercentTarget - selectionStartPercent !== 0) {
      window.requestAnimationFrame(() => this.animate(fast));
    }
  }

  private handleAminoAcidClick = (isSelected: boolean) => {
    if (!this.props.showInfoBox || (this.props.showInfoBox && isSelected)) {
      this.props.toggleShowInfoBox();
    }
  }

  private handleAminoAcidSliderClick = () => {
    this.props.toggleShowInfoBox();
  }

  private handleUpdateSelectedAminoAcidIndex = (selectedAminoAcidIndex: number, selectedAminoAcidXLocation: number) => {
    this.props.setSelectedAminoAcidIndex(selectedAminoAcidIndex, selectedAminoAcidXLocation);
  }

  private handleMark = (location: number) => {
    const existingMarks = this.state.marks;
    if (existingMarks.indexOf(location) > -1) {
      existingMarks.splice(existingMarks.indexOf(location), 1);
    } else {
      existingMarks.push(location);
    }
    this.setState({
      marks: existingMarks
    });
  }

  private handleDNAToggle = () => {
    this.props.toggleShowDNA();
  }

  private handleAminoAcidsToggle = () => {
    this.props.toggleShowingAminoAcidsOnProtein();
  }
}

export default withSize()(ProteinViewer);
