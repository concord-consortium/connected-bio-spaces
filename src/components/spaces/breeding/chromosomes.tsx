import * as React from "react";
import { BackpackMouseType } from "../../../models/backpack-mouse";

import "./chromosome.sass";

interface IProps {
 organism?: BackpackMouseType;
}

export const Chromosomes: React.SFC<IProps> = (props) => {
  const containerClass = "chromosomes" + (props.organism ? "" : " empty");
  const sex = props.organism ? props.organism.sex : "";

  return (
   <div className={containerClass}>
    <div className="chromosome-pair">
      <div className="chromosome">
        {getAlleleComponent(0, props.organism)}
      </div>
      <div className="chromosome">
        {getAlleleComponent(1, props.organism)}
      </div>
    </div>
    <div className="chromosome-pair">
      <div className="chromosome" />
      <div className="chromosome" />
    </div>
    <div className="chromosome-pair">
      <div className="chromosome" />
      <div className={`chromosome ${sex}`} />
    </div>
   </div>
 );
};

function getAlleleComponent(allele: number, org?: BackpackMouseType) {
  if (!org) {
    return null;
  }
  const alleleLabel = org.genotype.charAt(allele);
  return (
    <div className="allele">
      <div className="label">
        { alleleLabel }
      </div>
      <div className="line" />
    </div>
  );
}
