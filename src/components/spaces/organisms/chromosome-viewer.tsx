import * as React from "react";
import SVG from "react-inlinesvg";
import "./chromosome-viewer.sass";
import { ChromIdType } from "../../../models/spaces/organisms/organisms-row";
import { Genotype } from "../../../models/backpack-mouse";

const chromoNames = {
  c2a: "2a",
  c2b: "2b",
  c8a: "8a",
  c8b: "8b",
  x1: "X",
  x2: "X",
  y: "Y"
};

interface GeneInfo {name: string; alleles: number; }

const geneInfoList: {[chNumber: string]: GeneInfo[]} = {
  c2: [
    {
      name: "Agouti",
      alleles: 85
    },
    {
      name: "Bloc1s6",
      alleles: 6
    }
  ],
  c8: [
    {
      name: "Mc1r",
      alleles: 10
    },
    {
      name: "Atp7b",
      alleles: 4
    }
  ],
  x: [
    {
      name: "Atp7a",
      alleles: 4
    }
  ],
  y: []
};

interface ChromosomeInfo {genes: string; furColor: string; basePairs: string; }
const chomosomeInfoList: {[chNumber: string]: ChromosomeInfo} = {
  c2: {
    genes: "1,910",
    furColor: "38",
    basePairs: "182 million"
  },
  c8: {
    genes: "1,116",
    furColor: "30",
    basePairs: "129 million"
  },
  x: {
    genes: "990",
    furColor: "20",
    basePairs: "171 million"
  },
  y: {
    genes: "191",
    furColor: "0",
    basePairs: "92 million"
  }
};

interface IProps {
  genotype: Genotype;
  chromosome: ChromIdType;
  colored: boolean;
}

const ChromosomeViewer: React.StatelessComponent<IProps> = props => {

  const { genotype, chromosome, colored } = props;
  const chromoNumber = chromosome.length > 1 ? chromosome.slice(0, -1) : chromosome;
  const genes = geneInfoList[chromoNumber];
  const chromosomeInfo = chomosomeInfoList[chromoNumber];
  const inheritedFromMother = chromosome.slice(-1) === "a" || chromosome.slice(-1) === "1";
  return (
    <div className="chromosome-viewer">
      <div className="title">
        Chromosome: {chromoNames[chromosome]}
      </div>
      <div className="chromosome-details">
        <div className="chromosome-image">
          <SVG src={`assets/curriculum/mouse/nucleus/chromosome-${chromosome}-inspect.svg`}
            className={ colored ? chromoNumber : "" } />
          { chromosome !== "y" &&
          <img src={`assets/curriculum/mouse/nucleus/chromosome-${chromosome}-inspect-markers.svg`} />
          }
        </div>
        <div className={"chromosome-genes " + chromoNumber}>
          {
            genes.map(gene => (
              <div className="gene" key={gene.name}>
                <div className="label">
                  Fur color gene:
                </div>
                <div>
                  {gene.name}
                </div>
                <div>
                  <span className="label">Alleles:</span> {gene.alleles}
                </div>
              </div>
            ))
          }
        </div>
        <div className="chromosome-info">
          <div>
            <span className="label">Inherited from:</span> {inheritedFromMother ? "Mother" : "Father"}
          </div>
          <div>
            <span className="label">Genes:</span> {chromosomeInfo.genes}
          </div>
          <div>
            <span className="label">Fur color genes:</span> {chromosomeInfo.furColor}
          </div>
          <div>
            <span className="label">Base pairs:</span> {chromosomeInfo.basePairs}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChromosomeViewer;
