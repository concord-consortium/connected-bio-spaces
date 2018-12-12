/* global ActiveXObject */

export default function parseSVG(svgString: string) {
  let doc;
  if (typeof DOMParser !== "undefined") {
    const parser = new DOMParser();
    doc = parser.parseFromString(svgString, "text/xml");
  } else if (window.ActiveXObject) {
    doc = new (ActiveXObject as any)("Microsoft.XMLDOM");
    doc.async = "false";
    // IE chokes on DOCTYPE
    doc.loadXML(svgString.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i, ""));
  }
  return doc.documentElement;
}

interface PointOnPath extends DOMPoint {
  length: number;
  distance: number;
}

export function closestPointOnPath({x, y}: {x: number, y: number}, pathNode: SVGPathElement) {
  const pathLength = pathNode.getTotalLength();
  let precision = 8;
  let best: DOMPoint = pathNode.getPointAtLength(0);
  let bestLength = 0;
  let bestDistance = Infinity;

  function distance2(p: {x: number, y: number}) {
    const dx = p.x - x;
    const dy = p.y - y;
    return dx * dx + dy * dy;
  }

  // linear scan for coarse approximation
  for (let scanLength = 0; scanLength <= pathLength; scanLength += precision) {
    const scan = pathNode.getPointAtLength(scanLength);
    const scanDistance = distance2(scan);
    if (scanDistance < bestDistance) {
      best = scan;
      bestLength = scanLength;
      bestDistance = scanDistance;
    }
  }

  // binary search for precise estimate
  precision /= 2;
  let beforeLength;
  let afterLength;
  let before;
  let after;
  let beforeDistance;
  let afterDistance;
  while (precision > 0.5) {
    beforeLength = bestLength - precision;
    afterLength = bestLength + precision;
    before = pathNode.getPointAtLength(beforeLength);
    after = pathNode.getPointAtLength(afterLength);
    beforeDistance = distance2(before);
    afterDistance = distance2(after);
    if (beforeLength >= 0 && beforeDistance < bestDistance) {
      best = before;
      bestLength = beforeLength;
      bestDistance = beforeDistance;
    } else if (afterLength <= pathLength && afterDistance < bestDistance) {
      best = after;
      bestLength = afterLength;
      bestDistance = afterDistance;
    } else {
      precision /= 2;
    }
  }

  const ret: PointOnPath = {
    ...best,
    length: bestLength,
    distance: Math.sqrt(bestDistance)
  };
  return ret;
}
