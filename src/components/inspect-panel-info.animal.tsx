import * as React from "react";
import { BackpackMouseType, InspectContext } from "../models/backpack-mouse";
import { speciesDef } from "../models/units";
import { renderGameteIcons } from "./inspect-panel";

export function renderAnimalInfo(
    org: BackpackMouseType, context: InspectContext, isGamete: boolean, showGenotype: boolean): JSX.Element {
  const species = speciesDef(org.species);
  const sexLabel = org.sex === "female" ? "Female" : "Male";
  const colorLabel = species.getPhenotypeLabel(org.phenotype);
  const genotypeLabel = species.getGenotypeHTMLLabel(org.genotype);
  const rowClass = "info-row" + (context === "nest" ? "" : " wide");
  const mouseInfoClass = "mouse-info" + (context === "population" ? " no-header" : "");
  const infoTypeClass = "info-type" + (context === "population"  ? " population " : "");
  return (
    <>
      <div className="mouse-label">
        {context === "offspring" ? "Offspring" : (org.sex === "female" ? "Mother" : "Father")}
      </div>
      <div className={mouseInfoClass}>
        <div className={rowClass}>
          <div className={infoTypeClass}>
            {speciesDef(org.species).phenotypeHeading + ": "}
            <span className="info-data">{colorLabel}</span>
          </div>
        </div>
        { (!isGamete || context === "offspring") &&
          <div className={rowClass}>
            <div className={infoTypeClass}>
              {"Sex: "}
              <span className="info-data">{sexLabel}</span>
            </div>
          </div>
        }
        { showGenotype &&
          <div className={rowClass}>
            <div className={infoTypeClass}>
              {"Genotype: "}
              <span className="info-data"
                dangerouslySetInnerHTML={{ __html: genotypeLabel }}
              />
            </div>
          </div>
        }
        { (isGamete && context !== "offspring") &&
          <div className={rowClass}>
            <div className={infoTypeClass}>
              {"Gametes: "}
              <span className="info-data"
              dangerouslySetInnerHTML={{ __html: getGameteLabel(org) }}
              />
            </div>
          </div>
        }
        { (isGamete && context !== "offspring") &&
          <div className={rowClass}>
            <div className={infoTypeClass}>
              {"Gametes given to offspring: "}
              <span className="info-data">{getGameteOffspringLabel(org)}</span>
            </div>
          </div>
        }
        { (isGamete && context !== "offspring") &&
          renderGameteIcons(org)
        }
      </div>
    </>
  );
}

function getGameteLabel(mouse: BackpackMouseType) {
  const species = speciesDef(mouse.species);
  const label = species.getGameteHTMLLabel;
  const producedLabel = mouse.sex === "female" ? "eggs" : "sperm";
  const allele1 = mouse.genotype.slice(0, 1);
  const allele2 = mouse.genotype.slice(-1);
  const alleleLabel = allele1 !== allele2
                      ? `either the ${label(allele1)} allele or the ${label(allele2)} allele`
                      : `the ${label(allele1)} allele`;
  return `This ${mouse.sex} can produce ${producedLabel} with ${alleleLabel}.`;
}

function getGameteOffspringLabel(mouse: BackpackMouseType) {
  const parentLabel = mouse.sex === "female" ? "mother" : "father";
  const producedLabel = mouse.sex === "female" ? "eggs" : "sperm";
  return `For the selected litter, these were the ${producedLabel} that came from the ${parentLabel}.`;
}
