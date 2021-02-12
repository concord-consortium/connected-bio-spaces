import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";
import { BackpackMouseType, InspectContext } from "../models/backpack-mouse";
import { StackedOrganism } from "./stacked-organism";
import { speciesDef, units } from "../models/units";
import "./inspect-panel.sass";
import "./inspect-panel.pea.sass";

interface IProps extends IBaseProps {
  mouse1?: BackpackMouseType;
  mouse2?: BackpackMouseType;
  pairLabel: string;
  pairMeta?: string;
  isOffspring: boolean;
  isGamete: boolean;
  isPopulationInspect?: boolean;
  showGenotype: boolean;
}
interface IState {}

export class InspectPanel extends BaseComponent<IProps, IState> {

  public render() {
    const { mouse1, mouse2, pairLabel, pairMeta } = this.props;
    let className = "inspect-panel";
    if (mouse1) {
      className += " " + mouse1.species;
    }
    return(
      <div className={className}>
        {(mouse1 && mouse2) && this.renderInspectedPair(mouse1, mouse2, pairLabel, pairMeta)}
        {(mouse1 && !mouse2) && this.renderInspectedMouse(mouse1)}
      </div>
    );
  }

  private renderInspectedPair(leftMouse: BackpackMouseType, rightMouse: BackpackMouseType,
                              label: string, meta?: string) {
    const flipRight = units[rightMouse.species].breeding.flipRightNestParent;
    return(
      <div>
        <div className="inspect-title">{label}</div>
        <div className={`pair-container pair ${meta ? meta : ""}`}>
          <div className="inspect-background" />
          {this.renderMouse(leftMouse, false)}
          {this.renderMouse(rightMouse, flipRight)}
        </div>
      </div>
    );
  }

  private renderInspectedMouse(mouse: BackpackMouseType) {
    const classModifiers = "single " + (this.props.isGamete ? "gamete " : "")
    + (this.props.isPopulationInspect ? "population " : "")
    + (this.props.isGamete && this.props.isOffspring ? "low " : "")
    + (this.props.isOffspring ? "offspring " : "parent ")
    + mouse.sex;
    const containerClass = "pair-container " + classModifiers;
    const bgClass = "inspect-background " + classModifiers;
    const allowFlip = units[mouse.species].breeding.flipRightNestParent;
    const flipImage = allowFlip && !this.props.isPopulationInspect && !this.props.isOffspring && mouse.sex === "male";
    return(
      <div className={containerClass}>
        { (this.props.isGamete && this.props.isOffspring) && this.renderGametePanel(mouse) }
        <div className={bgClass} />
        {this.renderMouse(mouse, flipImage)}
      </div>
    );
  }

  private renderMouse(mouse: BackpackMouseType, flip: boolean) {
    const context: InspectContext =
      this.props.mouse2 ? "nest" :
      this.props.isOffspring ? "offspring" : "parent";
    const mouseImage = mouse.getInspectImage(context);
    const showSex = units[mouse.species].species.showSexStack;
    return (
      <div className="mouse-container">
        <StackedOrganism
          organism={mouse}
          organismImages={[mouseImage]}
          height={170}
          showSelection={false}
          showSex={showSex}
          showHetero={true}
          flipped={flip}
        />
        { !this.props.isPopulationInspect &&
          <div className="mouse-label">
            {this.props.isOffspring ? "Offspring" : (mouse.sex === "female" ? "Mother" : "Father")}
          </div>
        }
        {this.renderMouseInfo(mouse)}
      </div>
    );
  }

  private renderMouseInfo(mouse: BackpackMouseType) {
    const species = speciesDef(mouse.species);
    const sexLabel = mouse.sex === "female" ? "Female" : "Male";
    const colorLabel = species.getPhenotypeLabel(mouse.phenotype);
    const genotypeLabel = species.getGenotypeHTMLLabel(mouse.genotype);
    const rowClass = "info-row" + (this.props.mouse2 ? "" : " wide");
    const mouseInfoClass = "mouse-info" + (this.props.isPopulationInspect ? " no-header" : "");
    const infoTypeClass = "info-type" + (this.props.isPopulationInspect ? " population " : "");
    return (
      <div className={mouseInfoClass}>
        <div className={rowClass}>
          <div className={infoTypeClass}>
            {speciesDef(mouse.species).phenotypeHeading + ": "}
            <span className="info-data">{colorLabel}</span>
          </div>
        </div>
        { (!this.props.isGamete || this.props.isOffspring) &&
          <div className={rowClass}>
            <div className={infoTypeClass}>
              {"Sex: "}
              <span className="info-data">{sexLabel}</span>
            </div>
          </div>
        }
        { this.props.showGenotype &&
          <div className={rowClass}>
            <div className={infoTypeClass}>
              {"Genotype: "}
              <span className="info-data"
                dangerouslySetInnerHTML={{ __html: genotypeLabel }}
              />
            </div>
          </div>
        }
        { (this.props.isGamete && !this.props.isOffspring) &&
          <div className={rowClass}>
            <div className={infoTypeClass}>
              {"Gametes: "}
              <span className="info-data"
               dangerouslySetInnerHTML={{ __html: this.getGameteLabel(mouse) }}
              />
            </div>
          </div>
        }
        { (this.props.isGamete && !this.props.isOffspring) &&
          <div className={rowClass}>
            <div className={infoTypeClass}>
              {"Gametes given to offspring: "}
              <span className="info-data">{this.getGameteOffspringLabel(mouse)}</span>
            </div>
          </div>
        }
        { (this.props.isGamete && !this.props.isOffspring) &&
           this.renderGameteIcons(mouse)
        }
      </div>
    );
  }

  private renderGametePanel = (mouse: BackpackMouseType) => {
    const arrowImage = "assets/unit/mouse/breeding/inspect/inspect-arrow.png";
    const label1 = mouse.genotype.slice(0, 1);
    const label2 = mouse.genotype.slice(-1);
    return(
      <div className="gamete-panel">
        <div className="gamete-panel-container">
          <div className="gamete-panel-title">Egg from mother</div>
          { this.renderGameteIcon("female", label1) }
        </div>
        <div className="gamete-panel-container">
          <div className="gamete-panel-title">Sperm from father</div>
          { this.renderGameteIcon("male", label2) }
        </div>
        <img src={arrowImage} className="arrow" />
      </div>
    );
  }

  private renderGameteIcons = (mouse: BackpackMouseType) => {
    const label1 = mouse.genotype.slice(0, 1);
    const label2 = mouse.genotype.slice(-1);
    return(
      <div className="gamete-icons">
        { this.renderGameteIcon(mouse.sex, label1) }
        { label2 !== label1 && this.renderGameteIcon(mouse.sex, label2) }
      </div>
    );
  }

  private renderGameteIcon = (sex: string, label: string) => {
    if (!this.props.mouse1) return null;
    const species = speciesDef(this.props.mouse1.species);
    const iconClass = "gamete-icon " + (sex === "female" ? "egg" : "sperm");
    return(
      <div className="gamete-icon-container">
        <div className={iconClass} />
        <div className="gamete-label" dangerouslySetInnerHTML={{ __html: species.getGameteHTMLLabel(label) }}/>
      </div>
    );
  }

  private getGameteLabel = (mouse: BackpackMouseType) => {
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

  private getGameteOffspringLabel = (mouse: BackpackMouseType) => {
    const parentLabel = mouse.sex === "female" ? "mother" : "father";
    const producedLabel = mouse.sex === "female" ? "eggs" : "sperm";
    return `For the selected litter, these were the ${producedLabel} that came from the ${parentLabel}.`;
  }
}
