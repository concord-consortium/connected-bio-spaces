import * as React from "react";
import { svgPathProperties } from "svg-path-properties";
import parseSVG, { closestPointOnPath } from "./util/svg-utils";
import { getAminoAcidColor } from "./util/amino-acid-utils";

interface ProteinProps {
  svg: string;
  viewBox: string;
  width: number;
  height: number;
  selectionCenterIndex: number;
  selectionWidthInAAs: number;
  highlightColor?: string;
  marks?: number[];
  aminoAcids: string;
  showAminoAcids: boolean;
  updateSelectionIndex: (percent: number) => void;
}

interface DefaultProps {
  highlightColor: string;
  marks: number[];
}

type PropsWithDefaults = ProteinProps & DefaultProps;

const Protein: React.StatelessComponent<ProteinProps> = props => {

  const { svg, selectionCenterIndex, selectionWidthInAAs, highlightColor,
    marks, showAminoAcids, aminoAcids } = props as PropsWithDefaults;
  const svgModel = parseSVG(svg);

  const highlightPath = svgModel.querySelector("#highlight-path").cloneNode();
  const highlightProps = svgPathProperties(highlightPath.getAttribute("d"));
  const highlightPathTotalLength = highlightProps.getTotalLength();
  const totalAAsLength = aminoAcids.length;
  const halfSelectionLengthInAAs = (selectionWidthInAAs / 2);
  let selectionStartInAAs;
  let selectionLengthInAAs;
  if (selectionCenterIndex < halfSelectionLengthInAAs) {
    selectionStartInAAs = 0;
    selectionLengthInAAs = halfSelectionLengthInAAs + selectionCenterIndex;
  } else if (selectionCenterIndex > (totalAAsLength - halfSelectionLengthInAAs)) {
    selectionStartInAAs = selectionCenterIndex - halfSelectionLengthInAAs;
    selectionLengthInAAs = totalAAsLength - selectionStartInAAs;
  } else {
    selectionStartInAAs = selectionCenterIndex - halfSelectionLengthInAAs;
    selectionLengthInAAs = selectionWidthInAAs;
  }
  const selectionStartPercent = selectionStartInAAs / totalAAsLength;
  const selectionWidthPercent = (selectionLengthInAAs - 2) / totalAAsLength;    // - 2 because of the rounded linecap
  const selectionLength = highlightPathTotalLength * selectionWidthPercent;
  highlightPath.setAttribute("style", `fill:none;stroke:${highlightColor};stroke-width:12px;stroke-linecap:round`);
  highlightPath.setAttribute("stroke-dasharray", selectionLength + " " + highlightPathTotalLength);

  const selectionLeft = highlightPathTotalLength * selectionStartPercent;
  highlightPath.setAttribute("stroke-dashoffset", 0 - selectionLeft);

  const s = new XMLSerializer();
  const highlight = s.serializeToString(highlightPath);

  let dots;
  let backbone;
  if (showAminoAcids) {
    dots = aminoAcids.split("").map((aa, i) => {
      if (aa === "0") return null;
      const color = getAminoAcidColor(aa);
      const dist = i / aminoAcids.length * highlightPathTotalLength;
      const point = highlightProps.getPointAtLength(dist);

      return <circle key={i} cx={point.x} cy={point.y} r={2} style={{fill: color, stroke: "#222", strokeWidth: 0.5}} />;
    });
  } else {
    const backbonePath = svgModel.querySelector("#highlight-path").cloneNode();
    backbonePath.setAttribute("style", `fill:none;stroke:#231F2044;stroke-width:4px;stroke-linecap:round`);
    backbonePath.setAttribute("id", "backbone-path");
    backbone = s.serializeToString(backbonePath);
  }

  const markPaths = marks.map((loc, i) => {
    const dist = loc * highlightPathTotalLength;
    const point = highlightProps.getPointAtLength(dist);
    return <circle key={i} cx={point.x} cy={point.y} r={4} style={{fill: "none", stroke: "#FF0", strokeWidth: 3}} />;
  });

  let svgElRef: React.RefObject<{}>|null = null;
  const setSvgElRef = (element: any) => svgElRef = element;

  const onClick = (evt: React.MouseEvent<SVGSVGElement>) => {
    const svgEl = (svgElRef as any) as SVGSVGElement;
    const pt = svgEl.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    const svgPt = pt.matrixTransform(svgEl.getScreenCTM()!.inverse());
    const closestPoint = closestPointOnPath(svgPt, highlightProps);
    if (closestPoint.distance > 20) {
      // too far
      return;
    }
    const perc = closestPoint.length / highlightPathTotalLength;
    const indexSelected = props.aminoAcids.length * perc;
    props.updateSelectionIndex(indexSelected);
  };

  const aspectRatio = props.width / props.height;
  const maxWidth = 250;   // for now, while panels change size
  const width = Math.min(props.width, maxWidth);
  const height = width / aspectRatio;
  const divStyle = {width: props.width};

  return (
    <div className="protein" style={divStyle}>
      <svg ref={setSvgElRef} viewBox={props.viewBox} width={width} height={height}
          onClick={onClick}>
        <g dangerouslySetInnerHTML={{__html: props.svg}} />
        { backbone && <g dangerouslySetInnerHTML={{__html: backbone}} /> }
        <g dangerouslySetInnerHTML={{__html: highlight}} />
        { dots }
        { markPaths }
      </svg>
    </div>
  );
};

Protein.defaultProps = {
  highlightColor: "#ffa56dAA",
  marks: []
};

export default Protein;
