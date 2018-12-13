import * as React from "react";
import { svgPathProperties } from "svg-path-properties";
import parseSVG, { closestPointOnPath } from "./util/svg-utils";
import { getAminoAcidColor } from "./util/amino-acid-utils";
import "./protein.sass";

interface ProteinProps {
  svg: string;
  viewBox: string;
  width: number;
  height: number;
  selectionStartPercent: number;
  selectionPercent: number;
  highlightColor?: string;
  marks?: number[];
  aminoAcids: string;
  showAminoAcids: boolean;
  updateSelectionStart: (percent: number) => void;
}

interface DefaultProps {
  highlightColor: string;
  marks: number[];
}

type PropsWithDefaults = ProteinProps & DefaultProps;

const Protein: React.StatelessComponent<ProteinProps> = props => {

  const { svg, selectionPercent, highlightColor,
    selectionStartPercent, marks, showAminoAcids, aminoAcids } = props as PropsWithDefaults;
  const svgModel = parseSVG(svg);

  const highlightPath = svgModel.querySelector("#highlight-path").cloneNode();
  const highlightProps = svgPathProperties(highlightPath.getAttribute("d"));
  const highlightPathTotalLength = highlightProps.getTotalLength();
  const selectionLength = highlightPathTotalLength * selectionPercent;
  highlightPath.setAttribute("style", `fill:none;stroke:rgba(${highlightColor}, 0.6);stroke-width:22px;`);
  highlightPath.setAttribute("stroke-dasharray", selectionLength + " " + highlightPathTotalLength);

  const selectionLeft = highlightPathTotalLength * selectionStartPercent;
  highlightPath.setAttribute("stroke-dashoffset", 0 - selectionLeft);

  const s = new XMLSerializer();
  const highlight = s.serializeToString(highlightPath);

  const markPaths = marks.map(loc => {
    const dist = loc * highlightPathTotalLength;
    const point = highlightProps.getPointAtLength(dist);
    const point1 = highlightProps.getPointAtLength(dist - 5);
    const point2 = highlightProps.getPointAtLength(dist + 5);
    const angle = Math.atan2(point2.y - point1.y, point2.x - point1.x);
    const length = 10;
    const d = `M ${Math.sin(angle) * length + point.x} ${-Math.cos(angle) * length + point.y},
      L ${-Math.sin(angle) * length + point.x} ${Math.cos(angle) * length + point.y}`;

    return <path key={loc} d={d} style={{stroke: "#33F", strokeWidth: 3}} />;
  });

  let dots;
  if (showAminoAcids) {
    dots = aminoAcids.split("").map((aa, i) => {
      if (aa === "0") return null;
      const color = getAminoAcidColor(aa);
      const dist = i / aminoAcids.length * highlightPathTotalLength;
      const point = highlightProps.getPointAtLength(dist);

      return <circle key={i} cx={point.x} cy={point.y} r={2} style={{fill: color, stroke: "#222", strokeWidth: 0.5}} />;
    });
  }

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
    let perc = closestPoint.length / highlightPathTotalLength;
    perc = perc - (props.selectionPercent / 2);
    perc = Math.max(0, Math.min(perc, 1 - props.selectionPercent));
    props.updateSelectionStart(perc);
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
        <g dangerouslySetInnerHTML={{__html: highlight}} />
        { markPaths }
        { dots }
      </svg>
    </div>
  );
};

Protein.defaultProps = {
  highlightColor: "255, 255, 0",
  marks: []
};

export default Protein;
