import * as React from "react";

interface CodonProps {
  dna: string;
  x: number;
  y: number;
  dimmed: boolean;
  fontSize: number;
}
const Codon = ({dna, x, y, dimmed, fontSize}: CodonProps) =>
  <text x={x} y={y} opacity={dimmed ? .3 : 1} style={{fontSize}}>{dna.toUpperCase()}</text>;

export default Codon;
