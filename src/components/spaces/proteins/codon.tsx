import * as React from "react";

interface CodonProps {
  dna: string;
  x: number;
  y: number;
  fontSize: number;
}
const Codon = ({dna, x, y, fontSize}: CodonProps) =>
  <text x={x} y={y} className="codon"
    style={{fontSize}}>{dna.toUpperCase()}</text>;

export default Codon;
