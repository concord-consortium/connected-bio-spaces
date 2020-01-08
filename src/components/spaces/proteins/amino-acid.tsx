// tslint:disable:max-line-length
import * as React from "react";
import { getAminoAcidColor } from "./util/amino-acid-utils";

// dimensions of the viewBox the original images
const originalWidth = 100;

interface AminoAcidElementsType {
  [id: string]: JSX.Element;
}

const aminoAcidElements: AminoAcidElementsType = {
  A: <rect x="15.88" y="30" width="68.23" height="40" rx="3" ry="3" style={{fill: getAminoAcidColor("A")}}/>,
  C: <ellipse cx="50" cy="50" rx="38.82" ry="21.76" style={{fill: getAminoAcidColor("C")}}/>,
  D: <path d="M11.58,52.69,71,82.14a3,3,0,0,0,4.33-2.69V20.55A3,3,0,0,0,71,17.86L11.58,47.31A3,3,0,0,0,11.58,52.69Z" style={{fill: getAminoAcidColor("D")}}/>,
  E: <path d="M50,17.83a3.14,3.14,0,0,1,3.47-3.11,35.47,35.47,0,0,1,0,70.56A3.14,3.14,0,0,1,50,82.17Z" style={{fill: getAminoAcidColor("E")}}/>,
  F: <circle cx="50" cy="50" r="33.53" style={{fill: getAminoAcidColor("F")}}/>,
  G: <path d="M17.83,50a3.14,3.14,0,0,1-3.11-3.47,35.47,35.47,0,0,1,70.56,0A3.14,3.14,0,0,1,82.17,50Z" style={{fill: getAminoAcidColor("G")}}/>,
  H: <path d="M50,82.17a3.14,3.14,0,0,1-3.47,3.11,35.47,35.47,0,0,1,0-70.56A3.14,3.14,0,0,1,50,17.83Z" style={{fill: getAminoAcidColor("H")}}/>,
  I: <path d="M75.47,79.83l.27-46.95A3,3,0,0,0,73.55,30L28.34,17.3a3,3,0,0,0-3.81,2.87l-.27,47A3,3,0,0,0,26.45,70L71.66,82.7A3,3,0,0,0,75.47,79.83Z" style={{fill: getAminoAcidColor("I")}}/>,
  K: <path d="M88.42,47.31,29,17.86a3,3,0,0,0-4.33,2.69v58.9A3,3,0,0,0,29,82.14l59.4-29.45A3,3,0,0,0,88.42,47.31Z" style={{fill: getAminoAcidColor("K")}}/>,
  L: <ellipse cx="50" cy="50" rx="21.76" ry="38.82" style={{fill: getAminoAcidColor("L")}}/>,
  M: <path d="M47.31,11.58,17.86,71a3,3,0,0,0,2.69,4.33h58.9A3,3,0,0,0,82.14,71L52.69,11.58A3,3,0,0,0,47.31,11.58Z" style={{fill: getAminoAcidColor("M")}}/>,
  N: <path d="M52.69,88.42,82.14,29a3,3,0,0,0-2.69-4.33H20.55A3,3,0,0,0,17.86,29l29.45,59.4A3,3,0,0,0,52.69,88.42Z" style={{fill: getAminoAcidColor("N")}}/>,
  P: <path d="M85.29,50A35.29,35.29,0,1,1,50,14.71,35.29,35.29,0,0,1,85.29,50ZM50,33.55A16.45,16.45,0,1,0,66.45,50,16.44,16.44,0,0,0,50,33.55Z" style={{fill: getAminoAcidColor("P")}}/>,
  Q: <path d="M23.81,79.83l-.27-46.95A3,3,0,0,1,25.73,30L70.93,17.3a3,3,0,0,1,3.81,2.87l.27,47A3,3,0,0,1,72.82,70L27.62,82.7A3,3,0,0,1,23.81,79.83Z" style={{fill: getAminoAcidColor("Q")}}/>,
  R: <rect x="30" y="15.88" width="40" height="68.23" rx="3" ry="3" style={{fill: getAminoAcidColor("R")}}/>,
  S: <path d="M82.17,50a3.14,3.14,0,0,1,3.11,3.47,35.47,35.47,0,0,1-70.56,0A3.14,3.14,0,0,1,17.83,50Z" style={{fill: getAminoAcidColor("S")}}/>,
  T: <rect x="21.76" y="21.76" width="56.47" height="56.47" rx="3" ry="3" style={{fill: getAminoAcidColor("T")}}/>,
  V: <path d="M52.39,89.15,80.86,51.82a3,3,0,0,0,0-3.64L52.39,10.85a3,3,0,0,0-4.78,0L19.14,48.18a3,3,0,0,0,0,3.64L47.61,89.15A3,3,0,0,0,52.39,89.15Z" style={{fill: getAminoAcidColor("V")}}/>,
  W: <path d="M48.1,13.21l-30.59,25a3,3,0,0,0-1,3.07l8.87,34.4A3,3,0,0,0,28.28,78H71.72a3,3,0,0,0,2.9-2.25l8.87-34.4a3,3,0,0,0-1-3.07l-30.59-25A3,3,0,0,0,48.1,13.21Z" style={{fill: getAminoAcidColor("W")}}/>,
  Y: <path d="M48.5,14.19,19.74,30.79a3,3,0,0,0-1.5,2.6V66.61a3,3,0,0,0,1.5,2.6L48.5,85.81a3,3,0,0,0,3,0l28.76-16.6a3,3,0,0,0,1.5-2.6V33.39a3,3,0,0,0-1.5-2.6L51.5,14.19A3,3,0,0,0,48.5,14.19Z" style={{fill: getAminoAcidColor("Y")}}/>
};

interface AminoAcidProps {
  type: string;
  width?: number;
  x?: number;
  y?: number;
  marked?: boolean;
}

const AminoAcid: React.StatelessComponent<AminoAcidProps> = props => {
  const {type, width, x, y, marked} = props;
  const scale = width! / originalWidth;
  const transform = `
    scale(${scale})
    translate(${x! / scale}, ${y! / scale})
  `;
  const outlineColor = marked ? "#FF0" : "#ffd9c088";
  return (
    <g transform={transform}>
      <circle id="AA outline"
        cx={originalWidth / 2}
        cy={originalWidth / 2}
        r={(originalWidth / 2) + 10}
        style={{fill: outlineColor}} />
      <circle id="AA back" data-name="AA back"
        cx={originalWidth / 2}
        cy={originalWidth / 2}
        r={originalWidth / 2}
        style={{fill: "rgb(135, 146, 157)"}} />
      <g id="AA shape">
        { aminoAcidElements[type] }
      </g>
    </g>
  );
};

AminoAcid.defaultProps = {
  width: 18,
  x: 0,
  y: 0
};

export default AminoAcid;
