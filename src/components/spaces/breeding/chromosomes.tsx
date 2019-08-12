import * as React from "react";
import { BackpackMouseType } from "../../../models/backpack-mouse";

import "./chromosome.sass";
import { Gamete } from "../../../utilities/genetics";

interface IProps {
 organism?: BackpackMouseType;
 gamete?: Gamete;
 onRight?: boolean;
}

export const Chromosomes: React.SFC<IProps> = (props) => {
  if (!props.gamete) {
    const { organism } = props;
    const containerClass = "chromosomes" + (organism ? "" : " empty");
    const sex = organism ? organism.sex : "";
    const allele1 = organism ? organism.genotype.charAt(0) : null;
    const allele2 = organism ? organism.genotype.charAt(1) : null;

    return (
      <div className={containerClass}>
        <div className="chromosome-pair">
          <div className="chromosome">
            {getAlleleComponent(allele1)}
          </div>
          <div className="chromosome">
            {getAlleleComponent(allele2)}
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
  } else {
    const sex = props.gamete.sexChromosome === "Y" ? "male" : "";

    return (
      <div className="chromosomes">
        <div className="chromosome-pair">
          <div className={`chromosome ${props.onRight ? "right" : ""}`}>
            {getAlleleComponent(props.gamete.allele)}
          </div>
        </div>
        <div className="chromosome-pair">
          <div className="chromosome" />
        </div>
        <div className="chromosome-pair">
          <div className={`chromosome ${sex}`} />
        </div>
      </div>
    );
  }
};

function getAlleleComponent(alleleLabel: string | null) {
  if (!alleleLabel) {
    return null;
  }
  return (
    <div className="allele">
      <div className="label">
        { alleleLabel }
      </div>
      <div className="line" />
    </div>
  );
}
