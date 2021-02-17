import * as React from "react";
import { BackpackMouseType, InspectContext } from "../models/backpack-mouse";
import { speciesDef } from "../models/units";
import { renderGameteIcons } from "./inspect-panel";

export function renderPlantInfo(
    org: BackpackMouseType, context: InspectContext, isGamete: boolean, showGenotype: boolean): JSX.Element {
  switch (context) {
    case "nest":
      return renderNestInfo(org, showGenotype);
    case "parent":
      return renderParentInfo(org, showGenotype, isGamete);
  }

  const species = speciesDef(org.species);
  const phenotypeLabel = species.getPhenotypeLabel(org.phenotype);
  const genotypeLabel = species.getGenotypeHTMLLabel(org.genotype);
  const mouseInfoClass = "mouse-info" + (context === "population" ? " no-header" : "");
  const infoTypeClass = "info-type" + (context === "population"  ? " population " : "");
  return (
    <>
      <div className="mouse-label">
        Offspring
      </div>
      <div className={mouseInfoClass}>
        <div className="info-row wide">
          <div className={infoTypeClass}>
            {speciesDef(org.species).phenotypeHeading + ": "}
            <span className="info-data">{phenotypeLabel}</span>
          </div>
        </div>
        { showGenotype &&
          <div className="info-row wide">
            <div className={infoTypeClass}>
              {"Genotype: "}
              <span className="info-data"
                dangerouslySetInnerHTML={{ __html: genotypeLabel }}
              />
            </div>
          </div>
        }
      </div>
    </>
  );
}

function renderNestInfo(org: BackpackMouseType, showGenotype: boolean) {
  const species = speciesDef(org.species);
  const phenotypeLabel = species.getPhenotypeLabel(org.phenotype);
  const genotypeLabel = species.getGenotypeHTMLLabel(org.genotype);
  return (
    <>
      <div className="mouse-label">
        {org.label}
      </div>
      <div className="mouse-info">
        <div className="info-row">
          <div className="info-type">
            Grown from:
          </div>
        </div>
        <div className="info-row">
          <img className="seed-image" src={org.baseImage} />
          <div className="info-data">
            a {phenotypeLabel.toLowerCase()} seed
          </div>
        </div>
        { showGenotype &&
          <div className="info-row">
            <div className="info-type">
              {"Genotype: "}
              <span className="info-data"
                dangerouslySetInnerHTML={{ __html: genotypeLabel }}
              />
            </div>
          </div>
        }
      </div>
    </>
  );
}

function renderParentInfo(org: BackpackMouseType, showGenotype: boolean, isGamete: boolean) {
  const species = speciesDef(org.species);
  const phenotypeLabel = species.getPhenotypeLabel(org.phenotype);
  const genotypeLabel = species.getGenotypeHTMLLabel(org.genotype);
  return (
    <>
      <div className="mouse-label">
        Flower from {org.label}
      </div>
      <div className="mouse-info">
        <div className="info-row wide">
          <div className="info-type">
            {"Flower part: "}
            <span className="info-data">
              {org.sex === "female" ? "Ovary" : "Pollen from stamen"}
            </span>
          </div>
        </div>
        { !isGamete &&
          <>
            <div className="info-row wide">
              <div className="info-type">
                Grown from:
              </div>
            </div>
            <div className="info-row wide">
              <img className="seed-image" src={org.baseImage} />
              <div className="info-data">
                a {phenotypeLabel.toLowerCase()} seed
              </div>
            </div>
          </>
        }
        { showGenotype &&
          <div className="info-row wide">
            <div className="info-type">
              {"Genotype: "}
              <span className="info-data"
                dangerouslySetInnerHTML={{ __html: genotypeLabel }}
              />
            </div>
          </div>
        }
        { !isGamete &&
          <div className="info-row wide">
            <div className="info-type">
              Note:
              <span className="info-data">
                {
                  org.sex === "female" ?
                    " This flower's ovary receives the pollen of the other flower." :
                    " This flower's pollen fertilizes the ovary of the other flower."
                }
              </span>
            </div>
          </div>
        }
        {
          isGamete &&
          <>
            <div className="info-row wide">
              <div className="info-type">
                {"Gametes: "}
                <span className="info-data"
                  dangerouslySetInnerHTML={{ __html: getGameteLabel(org) }}
                />
              </div>
            </div>
            <div className="info-row wide">
              <div className="info-type">
                {"Gametes given to offspring: "}
                <span className="info-data">{getGameteOffspringLabel(org)}</span>
              </div>
            </div>
            { renderGameteIcons(org) }
          </>
        }
      </div>
    </>
  );
}

function getGameteLabel(org: BackpackMouseType) {
  const species = speciesDef(org.species);
  const label = species.getGameteHTMLLabel;
  const organLabel = org.sex === "female" ? "ovary" : "pollen";
  const producedLabel = org.sex === "female" ? "eggs" : "sperm";
  const allele1 = org.genotype.slice(0, 1);
  const allele2 = org.genotype.slice(-1);
  const alleleLabel = allele1 !== allele2
                      ? `either the ${label(allele1)} allele or the ${label(allele2)} allele`
                      : `the ${label(allele1)} allele`;
  return `This flower's ${organLabel} can produce ${producedLabel} with ${alleleLabel}.`;
}

function getGameteOffspringLabel(org: BackpackMouseType) {
  const organLabel = org.sex === "female" ? "ovary" : "pollen";
  const producedLabel = org.sex === "female" ? "eggs" : "sperm";
  return `For the selected pea pod, these were the ${producedLabel} from this plant's ${organLabel}.`;
}

export function getPairFooter(context: InspectContext, org1: BackpackMouseType, org2?: BackpackMouseType) {
  if (context !== "nest" || !org2) return null;
  const selfPollinate = org1.label === org2.label;

  return (
    <div className="inspect-footer">
      <div className="footer-title">
        {
          selfPollinate ?
          `${org1.label} will self-pollinate.` :
          `${org1.label} and ${org2.label} will cross-pollinate.`
        }
      </div>
      <div className="footer-body">
        Pollen from a {org1.label} flower will be used to fertilize
        a {org2.label} flower.
      </div>
    </div>
  );
}

export const plantInspectPanelStrings = {
  motherGameteLabel: "Egg cell",
  fatherGameteLabel: "Sperm cell",
};
