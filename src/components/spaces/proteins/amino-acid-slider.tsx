import * as React from "react";
import { Component } from "react";
import "./amino-acid-slider.sass";

import AminoAcid from "./amino-acid";
import Codon from "./codon";

let lastMouseDownTime = -1;
const maxClickTime = 500;

const chainMargin = 4;          // space at start and end of chain
const aminoAcidMargin = 2;      // space between AAs when no codons are showing
const codonMargin = 6;          // space between codons

export const kSliderHeight = 50;

interface AminoAcidSliderProps {
  aminoAcids?: string;
  codons?: string[];
  width?: number;
  aminoAcidWidth?: number;
  codonWidth?: number;
  selectionStartPercent?: number;
  selectionWidth?: number;
  selectedAminoAcidIndex: number;
  highlightColor?: string;
  marks?: number[];
  showDNA?: boolean;
  dnaFontHeight?: number;
  dimUnselected: boolean;
  updateSelectionStart: (selectionStart: number) => void;
  updateSelectedAminoAcidIndex: (selectedAminoAcidIndex: number,
                                 selectedAminoAcidXLocation: number, showInfo?: boolean) => void;
  onClick: () => void;
}

// annoying pattern because Typescript doesn't underdtand default props.
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/11640
interface DefaultProps {
  aminoAcids: string;
  codons: string[];
  width: number;
  selectionWidth: number;
  selectionStartPercent: number;
  aminoAcidWidth: number;
  codonWidth: number;
  showDNA: boolean;
  dnaFontHeight: number;
  marks: number[];
}

type PropsWithDefaults = AminoAcidSliderProps & DefaultProps;

interface AminoAcidSliderState {
  dragging: boolean;
  draggingXStart: number;
  draggingInitialStartPercent: number;
}

export default class AminoAcidSlider extends Component<AminoAcidSliderProps, AminoAcidSliderState> {

  public static defaultProps: DefaultProps = {
    aminoAcids: "",
    codons: [],
    width: 300,
    selectionWidth: 70,
    selectionStartPercent: 0,
    aminoAcidWidth: 17,
    codonWidth: 29,
    showDNA: false,
    dnaFontHeight: 16,
    marks: []
  };

  private wrapperRef: React.RefObject<{}>|null;
  private selectionRef: React.RefObject<{}>|null;
  private dnaStringRef: React.RefObject<{}>|null;
  private setWrapperRef: (element: any) => void;
  private setSelectionRef: (element: any) => void;
  private setDnaStringRef: (element: any) => void;

  constructor(props: AminoAcidSliderProps) {
    super(props);
    this.state = {
      dragging: false,
      draggingXStart: 0,
      draggingInitialStartPercent: 0
    };

    this.wrapperRef = null;
    this.selectionRef = null;
    this.dnaStringRef = null;
    this.setWrapperRef = (element) => this.wrapperRef = element;
    this.setSelectionRef = (element) => this.selectionRef = element;
    this.setDnaStringRef = (element) => this.dnaStringRef = element;
  }

  public componentDidUpdate(props: AminoAcidSliderProps, state: AminoAcidSliderState) {
    if (this.state.dragging && !state.dragging) {
      document.addEventListener("mousemove", this.onMouseMove);
      document.addEventListener("mouseup", this.onMouseUp);
    } else if (!this.state.dragging && state.dragging) {
      document.removeEventListener("mousemove", this.onMouseMove);
      document.removeEventListener("mouseup", this.onMouseUp);
    }
    if (this.currentlySelectedAminoAcidIndex !== this.props.selectedAminoAcidIndex) {
      this.props.updateSelectedAminoAcidIndex(this.currentlySelectedAminoAcidIndex,
        this.getXLocationOfAminoAcid(this.currentlySelectedAminoAcidIndex));
    }
  }

  /** distance between amino acids */
  get aminoAcidSpacing() {
    const { codonWidth, aminoAcidWidth } = this.props as PropsWithDefaults;
    if (this.props.showDNA) {
      return codonWidth + codonMargin;
    } else {
      return aminoAcidWidth + aminoAcidMargin;
    }
  }

  /** length amino acid chain would be in fuly drawn, in pixels */
  get aminoAcidChainLength() {
    const { aminoAcids } = this.props as PropsWithDefaults;
    return aminoAcids.length * (this.aminoAcidSpacing) + (chainMargin * 2);
  }

  /** width of selection box in pixels, which depends on whether DNA is visible */
  get actualSelectionWidth() {
    const { showDNA, aminoAcids, aminoAcidWidth, selectionWidth } = this.props as PropsWithDefaults;
    if (showDNA) {
      const noDNAChainLength = aminoAcids.length *
        (aminoAcidWidth + aminoAcidMargin) + (chainMargin * 2);
      return selectionWidth * (this.aminoAcidChainLength / noDNAChainLength);
    } else {
      return selectionWidth;
    }
  }

  /** width of selection box, as a % of total amino acid chain */
  get aminoAcidSelectionWidthPercent() {
    return this.actualSelectionWidth / this.aminoAcidChainLength;
  }

  /** distance along track user has dragged selection box. From 0 to 1.
   * cf `selectionStartPercent`, which is the left side of the selection box, and always < 1
   */
  get travelPercent() {
    const { selectionStartPercent } = this.props as PropsWithDefaults;
    // value of `selectionStartPercent` when we're at far-right of window
    const maxSelectionStartPercent = 1 - this.aminoAcidSelectionWidthPercent;
    // percent selection box has been dragged across window, where far-right is 1.0
    return Math.min(selectionStartPercent / maxSelectionStartPercent, 1);
  }

  /**
   * index of the single AA selected. This is usually the one closest to the center of the box, except near the ends
   * where it's at the edge of the selection box (or the ends would never be selected).
   */
  get currentlySelectedAminoAcidIndex() {
    const { aminoAcids, selectionStartPercent } = this.props as PropsWithDefaults;
    const aaIndexStart = (aminoAcids.length - 1) * selectionStartPercent;
    const numAAinSelectionBox = aminoAcids.length * this.aminoAcidSelectionWidthPercent;
    // Calculate position along selection box where AA is selected.
    // From 0-10% of travel, we go from the left edge to the center of the box. From 10-90% we stay at the center. From
    // 90-100% we move to the far right edge.
    const selectionPercentAlongBox = this.travelPercent < 0.1
      ? this.travelPercent * 5
      : this.travelPercent > 0.9 ? 0.5 + ((this.travelPercent - 0.9) * 5) : 0.5;
    return Math.round(aaIndexStart + (numAAinSelectionBox * selectionPercentAlongBox));
  }

  public render() {
    const {
      aminoAcids,
      codons,
      selectedAminoAcidIndex,
      width,
      aminoAcidWidth,
      dnaFontHeight,
      highlightColor,
      marks,
      showDNA,
      dimUnselected
    } = this.props as PropsWithDefaults;

    const frameStyle = {
      width: `${width}px`
    };

    const acidMargin = 2; // space below amino acids

    // furthest right offset selection box can be
    const maxSelectionBoxRightShift = width - this.actualSelectionWidth;
    // current selection box right offset
    const selectionRightShift = maxSelectionBoxRightShift * this.travelPercent;
    // center AA image in each space
    const innerAminoAcidOffset = (this.aminoAcidSpacing / 2) - (aminoAcidWidth / 2);

    let wrapperClass = "amino-acid-slider";

    if (selectionRightShift > 10) {
      wrapperClass += " fade-left";
    }
    if (selectionRightShift < maxSelectionBoxRightShift - 10) {
      wrapperClass += " fade-right";
    }

    const selectStyle: React.CSSProperties = {
      width: `${this.actualSelectionWidth}px`,
      left: `${selectionRightShift}px`
    };
    if (highlightColor) {
      selectStyle.border = `1px solid rgb(${highlightColor})`;
      selectStyle.backgroundColor = `rgba(${highlightColor}, 0.3)`;
    }

    // Returns an array of images containing both the AA shape and, optionally, the codon below
    const aminoAcidImages = aminoAcids.split("").map((a, i) => {
      const x = this.getXLocationOfAminoAcid(i);

      if (x < -this.aminoAcidSpacing || x > width) {
        return null;
      }

      // const codonOffset = chainOffset + i * (codonWidth + codonMargin);
      const dimmed = dimUnselected && selectedAminoAcidIndex !== i;
      const selected = marks.includes(i);
      return (
        <g key={i} onClick={this.onAminoAcidSelection(i)}>
          {
            selected &&
            <rect x={x + innerAminoAcidOffset - 1} y={1} width={aminoAcidWidth + 1} height={aminoAcidWidth + 2}
              style={{fill: "#33F", stroke: "#AAF", opacity: (dimmed ? 0.4 : 1), strokeWidth: 2}} />
          }
          {
            a !== "0" && a !== "1" &&
            <AminoAcid type={a} x={x + innerAminoAcidOffset} y={2.5} width={aminoAcidWidth} dimmed={dimmed} />
          }
          {
            showDNA &&
            <Codon dna={codons[i]} x={x} y={aminoAcidWidth + acidMargin + dnaFontHeight}
              fontSize={dnaFontHeight} dimmed={dimmed} />
          }
        </g>
      );
    });

    let svgHeight = aminoAcidWidth + acidMargin + 2;
    if (showDNA) {
          svgHeight += dnaFontHeight;
        }

    const chainLineStart = Math.max(0, this.getXLocationOfAminoAcid(0) + innerAminoAcidOffset + aminoAcidWidth / 2);
    const chainLineEnd = Math.min(width,
      this.getXLocationOfAminoAcid(aminoAcids!.length - 2) + innerAminoAcidOffset + aminoAcidWidth / 2);

    return (
      <div className={wrapperClass} style={frameStyle} ref={this.setWrapperRef}
          onMouseDown={this.onMouseDown}
          onClick={this.onClick}>
        <div
          className="selection"
          style={selectStyle}
          ref={this.setSelectionRef}
        />
        <div className="amino-acids" ref={this.setDnaStringRef}>
          <svg width={width} height={svgHeight} viewBox={`0 0 ${width} ${svgHeight}`}>
            <path d={`M${chainLineStart},${(aminoAcidWidth / 2) + 3}L${chainLineEnd},${(aminoAcidWidth / 2) + 3}`}
              style={{stroke: "#AAA", strokeWidth: "2px", opacity: (dimUnselected ? 0.4 : 1)}} />
            { aminoAcidImages }
          </svg>
        </div>
      </div>
    );
  }

   // returns x location within view of an amino acid, in pixels
   private getXLocationOfAminoAcid = (index: number) => {
    const { width } = this.props as PropsWithDefaults;
    // furthest left offset amino acid chain can be
    const maxAminoAcidLeftShift = this.aminoAcidChainLength - width;
    // current left shift
    const aminoAcidLeftShift = maxAminoAcidLeftShift * this.travelPercent;

    return (this.aminoAcidSpacing * index) - aminoAcidLeftShift + chainMargin;
  }

  // calculate relative position to the mouse and set dragging=true
  private onMouseDown = (evt: React.MouseEvent<HTMLDivElement>) => {
    // only left mouse button
    if (evt.button !== 0) return;

    const { selectionStartPercent } = this.props as PropsWithDefaults;

    this.setState({
      dragging: true,
      draggingXStart: evt.pageX,
      draggingInitialStartPercent: selectionStartPercent
    });
    evt.stopPropagation();
    evt.preventDefault();

    lastMouseDownTime = Date.now();
  }

  private onMouseUp = (evt: MouseEvent) => {
    this.setState({dragging: false});
    evt.stopPropagation();
    evt.preventDefault();
  }

  private onMouseMove = (evt: MouseEvent) => {
    if (!this.state.dragging) return;

    const { width } = this.props as PropsWithDefaults;

    const dx = evt.pageX - this.state.draggingXStart;
    const newStartPercent = this.state.draggingInitialStartPercent +
      (dx / (width - this.actualSelectionWidth));

    const maxSelectionStartPercent = 1 - this.aminoAcidSelectionWidthPercent;

    this.props.updateSelectionStart(Math.max(0, Math.min(newStartPercent, maxSelectionStartPercent)));

    evt.stopPropagation();
    evt.preventDefault();
  }

  private onClick = () => {
    // if it was to short
    if (Date.now() - lastMouseDownTime > maxClickTime) return;
    // or if we have stated dragging
    if (this.props.selectionStartPercent !== this.state.draggingInitialStartPercent) return;

    if (this.props.onClick) {
      this.props.onClick();
    }
  }

  private onAminoAcidSelection = (index: number) => {
    return (evt: React.MouseEvent<SVGGElement>) => {
      this.props.updateSelectedAminoAcidIndex(index, this.getXLocationOfAminoAcid(index), true);
      evt.stopPropagation();
      evt.preventDefault();
    };
  }
}
