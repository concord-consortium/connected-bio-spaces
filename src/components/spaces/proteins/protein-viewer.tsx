import { inject, observer } from "mobx-react";
import * as React from "react";
import { BaseComponent, IBaseProps } from "../../base";
import AminoAcidSlider from "./amino-acid-slider";
import Protein from "./protein";
import InfoBox from "./info-box";
import { extractCodons } from "./util/dna-utils";
import { getAminoAcidsFromCodons } from "./util/amino-acid-utils";
import "./protein-viewer.sass";
import { DEFAULT_MODEL_WIDTH } from "../../..";
import Slider from "rc-slider";

export interface ProteinSpec {
  dna: string;
  svgImage: string;
}

interface IProps extends IBaseProps {
  protein: ProteinSpec;
  selectedAminoAcidIndex: number;
  showInfoBox: boolean;
  aminoAcidWidth?: number;            // Width of one amino acid in the slider elements, in pixels
  codonWidth?: number;                // Width of one codon in the slider elements, in pixels
  showDNA?: boolean;
  showAminoAcidsOnProtein?: boolean;
  toggleShowDNA: () => void;
  toggleShowingAminoAcidsOnProtein: () => void;
  setSelectedAminoAcidIndex: (selectedAminoAcidIndex: number) => void;
  toggleShowInfoBox: () => void;
}

interface DefaultProps {
  selectedAminoAcidIndex: number;
  showInfoBox: boolean;
  aminoAcidWidth: number;
  codonWidth: number;
  showDNA: boolean;
  showAminoAcidsOnProtein: boolean;
}

type PropsWithDefaults = IProps & DefaultProps;

interface IState {
  hoveringOverInfoBox: boolean;
  hoveringOverMarkable: boolean;
  animating: boolean;
  selectedAminoAcidIndexTarget: number;
  marks: number[];
}

@inject("stores")
@observer
export default class ProteinViewer extends BaseComponent<IProps, IState> {

  public static defaultProps: DefaultProps = {
    selectedAminoAcidIndex: 0,
    showInfoBox: false,
    aminoAcidWidth: 20,
    codonWidth: 29,
    showDNA: false,
    showAminoAcidsOnProtein: false
  };

  constructor(props: IProps) {
    super(props);

    this.state = {
      hoveringOverInfoBox: false,
      hoveringOverMarkable: false,
      animating: false,
      selectedAminoAcidIndexTarget: 0,
      marks: []
    };
  }

  public render() {
    const {
      protein, aminoAcidWidth,
      showDNA, showAminoAcidsOnProtein,
      selectedAminoAcidIndex
    } = this.props as PropsWithDefaults;

    const width = DEFAULT_MODEL_WIDTH;

    const codons = extractCodons(protein.dna);
    const aminoAcids = getAminoAcidsFromCodons(codons);

    const proteinWidth = width * 0.33;
    const aaSliderMargins = 4;
    const aaSliderWidth = width - (aaSliderMargins * 2);

    const infoOptionsClass = "info-and-options";
    return (
      <div className="protein-viewer">
        <div className="proteins-and-sliders">
          <div className="proteins">
            <Protein
              width={proteinWidth}
              height={proteinWidth}
              selectionCenterIndex={selectedAminoAcidIndex}
              selectionWidthInAAs={14}
              updateSelectionIndex={this.handleAnimateToSelectionIndex}
              viewBox="0 30 254 150"
              svg={protein.svgImage}
              marks={this.state.marks.map(loc => loc / aminoAcids.length)}
              aminoAcids={aminoAcids}
              showAminoAcids={showAminoAcidsOnProtein}
            />
          </div>
          <div className="amino-acids">
            {
              this.state.hoveringOverMarkable &&
              <div className="mark">
                { this.state.marks.includes(selectedAminoAcidIndex)
                  ? "Unmark"
                  : "Mark"
                }
              </div>
            }
            <AminoAcidSlider
              aminoAcids={aminoAcids}
              codons={codons}
              width={aaSliderWidth}
              aminoAcidWidth={aminoAcidWidth}
              selectedAminoAcidIndex={selectedAminoAcidIndex}
              animateToSelectionIndex={this.handleAnimateToSelectionIndex}
              showDNA={showDNA}
              marks={this.state.marks}
              showMark={this.state.hoveringOverMarkable}
              onSelectedHoverEnter={this.setHoveringOverMarkable}
              onSelectedHoverExit={this.unsetHoveringOverMarkable}
              onMarkLocation={this.handleMark}
            />
          </div>
          <div className="amino-acids-scrubber">
            { this.renderAAScrubber(aminoAcids.length) }
          </div>
        </div>
        <div className={infoOptionsClass}>
          <InfoBox
            aminoAcids={aminoAcids}
            selection={selectedAminoAcidIndex}
            marks={this.state.marks}
            width={width - 26}
            hovered={this.state.hoveringOverInfoBox}
            onHoverEnter={this.setHoveringOverInfoBox}
            onHoverExit={this.unsetHoveringOverInfoBox}
            onMarkLocation={this.handleMark}
          />
          {/* <div className="options">
            <label>
              <input
                name="showInfoBox"
                type="checkbox"
                checked={showInfoBox}
                onChange={this.handleShowInfoBoxToggle} />
              Show Amino Acid Info
            </label>
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
          </div> */}
        </div>
      </div>
    );
  }

  private renderAAScrubber(aaLength: number) {
    const { selectedAminoAcidIndex } = this.props;

    const trackStyle = { backgroundColor: "#ffa56d", height: 10 };
    const handleStyle = {
      borderColor: "white",
      backgroundColor: "#ffd9c0",
      height: 20,
      width: 20
    };
    const railStyle = { backgroundColor: "#eb813e", height: 10 };

    return (
      <div className="line-chart-controls" id="line-chart-controls">
        <Slider className="scrubber"
          trackStyle={trackStyle}
          handleStyle={handleStyle}
          railStyle={railStyle}
          onChange={this.handleUpdateSelectedAminoAcidIndex}
          min={0}
          max={aaLength - 2}
          value={Math.min(selectedAminoAcidIndex, aaLength - 2)}
        />
      </div>
    );
  }

  private handleAnimateToSelectionIndex = (selectedAminoAcidIndexTarget: number) => {
    this.setState({
      animating: true,
      selectedAminoAcidIndexTarget: Math.round(selectedAminoAcidIndexTarget)
    }, this.animate);
  }

  private animate = (fast?: boolean) => {
    const { selectedAminoAcidIndex } = this.props as PropsWithDefaults;
    const { selectedAminoAcidIndexTarget, animating } = this.state;
    if (!animating) return;

    let speed;

    // if the initial request is far away, keep fast for all frames. Otherwise go slow.
    if (!fast) {
      if (Math.abs(selectedAminoAcidIndexTarget - selectedAminoAcidIndex) > 10) {
        fast = true;
      }
    }

    const maxSpeed = fast ? 4 : 1;
    if (selectedAminoAcidIndex > selectedAminoAcidIndexTarget) {
      speed = Math.max(-maxSpeed, selectedAminoAcidIndexTarget - selectedAminoAcidIndex);
    } else {
      speed = Math.min(maxSpeed, selectedAminoAcidIndexTarget - selectedAminoAcidIndex);
    }
    this.props.setSelectedAminoAcidIndex(selectedAminoAcidIndex + speed);
    if (selectedAminoAcidIndexTarget - selectedAminoAcidIndex !== 0) {
      window.requestAnimationFrame(() => this.animate(fast));
    }
  }

  private handleUpdateSelectedAminoAcidIndex = (selectedAminoAcidIndex: number) => {
    this.props.setSelectedAminoAcidIndex(Math.round(selectedAminoAcidIndex));
  }

  private handleMark = (location: number) => {
    const existingMarks = this.state.marks;
    if (existingMarks.includes(location)) {
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

  private handleShowInfoBoxToggle = () => {
    this.props.toggleShowInfoBox();
  }

  private setHoveringOverInfoBox = () => {
    this.setState({hoveringOverInfoBox: true, hoveringOverMarkable: true});
  }

  private unsetHoveringOverInfoBox = () => {
    this.setState({hoveringOverInfoBox: false, hoveringOverMarkable: false});
  }

  private setHoveringOverMarkable = () => {
    this.setState({hoveringOverMarkable: true});
  }

  private unsetHoveringOverMarkable = () => {
    this.setState({hoveringOverMarkable: false});
  }
}
