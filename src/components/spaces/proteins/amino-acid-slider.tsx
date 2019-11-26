import * as React from "react";
import { Component } from "react";
import "./amino-acid-slider.sass";

import AminoAcid from "./amino-acid";
import Codon from "./codon";

const aminoAcidMargin = 10;      // space between AAs when no codons are showing
export const kSliderHeight = 50;

interface AminoAcidSliderProps {
  aminoAcids?: string;
  codons?: string[];
  width?: number;
  aminoAcidWidth?: number;
  codonWidth?: number;
  selectedAminoAcidIndex?: number;
  marks?: number[];
  showDNA?: boolean;
  dnaFontHeight?: number;
  margins?: number;
  showMark: boolean;
  animateToSelectionIndex: (selectionIndex: number) => void;
  onSelectedHoverEnter: () => void;
  onSelectedHoverExit: () => void;
  onMarkLocation: (percent: number) => void;
}

// annoying pattern because Typescript doesn't understand default props.
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/11640
interface DefaultProps {
  aminoAcids: string;
  codons: string[];
  width: number;
  selectedAminoAcidIndex: number;
  aminoAcidWidth: number;
  codonWidth: number;
  showDNA: boolean;
  dnaFontHeight: number;
  margins: number;
  marks: number[];
}

type PropsWithDefaults = AminoAcidSliderProps & DefaultProps;

export default class AminoAcidSlider extends Component<AminoAcidSliderProps> {

  public static defaultProps: DefaultProps = {
    aminoAcids: "",
    codons: [],
    width: 300,
    selectedAminoAcidIndex: 0,
    aminoAcidWidth: 20,
    codonWidth: 29,
    showDNA: false,
    dnaFontHeight: 11,
    margins: 4,
    marks: []
  };

  public render() {
    const {
      aminoAcids,
      codons,
      width,
      aminoAcidWidth,
      dnaFontHeight,
      margins,
      marks,
      showDNA,
      showMark
    } = this.props as PropsWithDefaults;

    const marginBtwnAcidCodon = 2;

    const frameStyle = {
      width: `${width}px`,
      margin: `0 ${margins}px`
    };

    // center AA image in each space
    const innerAminoAcidOffset = (this.aminoAcidSpacing / 2) - (aminoAcidWidth / 2);

    const wrapperClass = "amino-acid-slider";

    // Returns an array of images containing both the AA shape and, optionally, the codon below
    const aminoAcidImages = aminoAcids.split("").map((a, i) => {
      const x = this.getXLocationOfAminoAcid(i);

      if (x < -this.aminoAcidSpacing || x > width) {
        return null;
      }

      let onHoverEnter: undefined | ((evt: any) => void);
      let onHoverExit: undefined | ((evt: any) => void);
      let onClick = this.onAminoAcidSelection(i);
      if (this.props.selectedAminoAcidIndex === i) {
        onHoverEnter = this.props.onSelectedHoverEnter;
        onHoverExit = this.props.onSelectedHoverExit;
        onClick = (evt: any) => this.props.onMarkLocation(i);
      }

      const marked = marks.includes(i);
      return (
        <g key={i}
            onMouseEnter={onHoverEnter}
            onMouseLeave={onHoverExit}
            onClick={onClick}>
          {
            a !== "0" && a !== "1" &&
            <AminoAcid type={a} x={x + innerAminoAcidOffset} y={showDNA ? -4 : 0} width={aminoAcidWidth}
              marked={marked} />
          }
          {
            showDNA &&
            <Codon dna={codons[i]} x={x + 5} y={aminoAcidWidth + marginBtwnAcidCodon + dnaFontHeight - 6}
              fontSize={dnaFontHeight} />
          }
        </g>
      );
    });

    const aaCenterHeight = 24;

    const chainLineStart = Math.max(0, this.getXLocationOfAminoAcid(0) + innerAminoAcidOffset + aminoAcidWidth / 2);
    const chainLineEnd = Math.min(width,
      this.getXLocationOfAminoAcid(aminoAcids!.length - 2) + innerAminoAcidOffset + aminoAcidWidth / 2);

    const focusBoxWidth = aminoAcidWidth + (this.aminoAcidSpacing / 2);
    const focusBoxX = (width / 2) - (focusBoxWidth / 2) - 4;
    const focusT1X = (width / 2) - 5 - 4;
    const focusT2X = (width / 2) + 5 - 4;
    const focusT3X = (width / 2) - 4;
    const focusT3Y = 8;
    return (
      <div className={wrapperClass} style={frameStyle}>
        <div className="amino-acids">
          <svg width={width} height={46} viewBox={`0 0 ${width} ${46}`}>
            <rect id="background" x={4} y={2} width={width - 8} height={44} rx={20}
              style={{fill: "#FFF"}}/>

            <rect id="aaBackground" x={chainLineStart - 16} y={4}
              width={chainLineEnd - chainLineStart + (16 * 2)}
              height={37}
              style={{fill: "#d4520088"}}/>

            <rect id="backgroundBorderWhite" x={4} y={3} width={width - 8} height={39} rx={20}
              style={{fill: "none", stroke: "#FFF", strokeWidth: 2}}/>

            <rect id="backgroundBorderPink" x={0} y={1} width={width - 2} height={43} rx={22}
              style={{fill: "none", stroke: "#ffd9c0", strokeWidth: 2}}/>

            <rect className="focusBox" x={focusBoxX} y={1} width={focusBoxWidth} height={42} rx="5" />
            <path className={`focusTriangle ${showMark ? "mark" : ""}`}
              d={`M${focusT1X},2L${focusT2X},2L${focusT3X},${focusT3Y}Z`} />
            <g transform={`translate(0, ${aaCenterHeight / 2})`}>
              <path id="chain"
                d={`M${chainLineStart},${(aminoAcidWidth / 2)}L${chainLineEnd},${(aminoAcidWidth / 2)}`}
                style={{stroke: "#5e5e5e", strokeWidth: "5px"}} />
              { aminoAcidImages }
            </g>

            <rect id="backgroundBorderWhiteTop" x={6.5} y={3} width={width - 10} height={39} rx={20}
              style={{fill: "none", stroke: "#FFF", strokeWidth: 2, strokeDasharray: "150 50 380 50 200 0"}}/>

            <rect id="backgroundBorderPinkTop" x={-2} y={-6} width={width + 7} height={57} rx={29}
              style={{fill: "none", stroke: "#ffd9c0", strokeWidth: 15, strokeDasharray: "150 50 400 50 200 0"}}/>

          </svg>
        </div>
      </div>
    );
  }

  /** distance between amino acids */
  get aminoAcidSpacing() {
    const { aminoAcidWidth } = this.props as PropsWithDefaults;
    return aminoAcidWidth + aminoAcidMargin;
  }

  /** length amino acid chain would be in fuly drawn, in pixels */
  get aminoAcidChainLength() {
    const { aminoAcids } = this.props as PropsWithDefaults;
    return aminoAcids.length * this.aminoAcidSpacing;
  }

  // returns x location within view of an amino acid, in pixels
  private getXLocationOfAminoAcid = (index: number) => {
    const { width, aminoAcidWidth, selectedAminoAcidIndex } = this.props as PropsWithDefaults;

    const scrollStartPercent = 0.5;      // the scrolling starts at the slider midpoint
    const start = width * scrollStartPercent - aminoAcidWidth;
    const aaDistance = this.aminoAcidSpacing * index;
    const offset = this.aminoAcidSpacing * selectedAminoAcidIndex;

    return start + aaDistance - offset;
  }

  private onAminoAcidSelection = (index: number) => {
    return (evt: React.MouseEvent<SVGGElement>) => {
      this.props.animateToSelectionIndex(index);
      evt.stopPropagation();
      evt.preventDefault();
    };
  }
}
