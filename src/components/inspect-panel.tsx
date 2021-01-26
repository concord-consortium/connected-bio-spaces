import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";
import { BackpackMouseType } from "../models/backpack-mouse";
import { StackedOrganism } from "./stacked-organism";
import { genotypeHTMLLabel, gameteHTMLLabel } from "../utilities/genetics";
import "./inspect-panel.sass";

interface IProps extends IBaseProps {
  mouse1?: BackpackMouseType;
  mouse2?: BackpackMouseType;
  pairLabel: string;
  isOffspring: boolean;
  isGamete: boolean;
  isPopulationInspect?: boolean;
  showGenotype: boolean;
}
interface IState {}

export class InspectPanel extends BaseComponent<IProps, IState> {

  public render() {
    const { mouse1, mouse2, pairLabel } = this.props;
    return(
      <div className="inspect-panel">
        {(mouse1 && mouse2) && this.renderInspectedPair(mouse1, mouse2, pairLabel)}
        {(mouse1 && !mouse2) && this.renderInspectedMouse(mouse1)}
      </div>
    );
  }

  private renderInspectedPair(leftMouse: BackpackMouseType, rightMouse: BackpackMouseType, label: string) {
    return(
      <div>
        <div className="inspect-title">{label}</div>
        <div className="pair-container">
          <div className="inspect-background" />
          {this.renderMouse(leftMouse, false)}
          {this.renderMouse(rightMouse, true)}
        </div>
      </div>
    );
  }

  private renderInspectedMouse(mouse: BackpackMouseType) {
    const bgClass = "inspect-background single " + (this.props.isGamete ? "gamete " : "")
                    + (this.props.isPopulationInspect ? "population " : "")
                    + (this.props.isGamete && this.props.isOffspring ? "low" : "");
    return(
      <div className="pair-container single">
        { (this.props.isGamete && this.props.isOffspring) && this.renderGametePanel(mouse) }
        <div className={bgClass} />
        {this.renderMouse(mouse, !this.props.isPopulationInspect && !this.props.isOffspring && mouse.sex === "male")}
      </div>
    );
  }

  private renderMouse(mouse: BackpackMouseType, flip: boolean) {
    const mouseImages = [mouse.baseImage];
    return (
      <div className="mouse-container">
        <StackedOrganism
          organism={mouse}
          organismImages={mouseImages}
          height={170}
          showSelection={false}
          showSex={true}
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
    const sexLabel = mouse.sex === "female" ? "Female" : "Male";
    const colorLabel = mouse.phenotype === "white" ? "Light brown" :
                       mouse.phenotype === "tan" ? "Medium brown" : "Dark brown";
    const genotypeLabel = genotypeHTMLLabel(mouse.genotype);
    const rowClass = "info-row" + (this.props.mouse2 ? "" : " wide");
    const mouseInfoClass = "mouse-info" + (this.props.isPopulationInspect ? " no-header" : "");
    const infoTypeClass = "info-type" + (this.props.isPopulationInspect ? " population " : "");
    return (
      <div className={mouseInfoClass}>
        <div className={rowClass}>
          <div className={infoTypeClass}>
            {"Fur Color: "}
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
    const iconClass = "gamete-icon " + (sex === "female" ? "egg" : "sperm");
    return(
      <div className="gamete-icon-container">
        <div className={iconClass} />
        <div className="gamete-label" dangerouslySetInnerHTML={{ __html: gameteHTMLLabel(label) }}/>
      </div>
    );
  }

  private getGameteLabel = (mouse: BackpackMouseType) => {
    const producedLabel = mouse.sex === "female" ? "eggs" : "sperm";
    const allele1 = mouse.genotype.slice(0, 1);
    const allele2 = mouse.genotype.slice(-1);
    const alleleLabel = allele1 !== allele2
                        ? `either the ${gameteHTMLLabel(allele1)} allele or the ${gameteHTMLLabel(allele2)} allele`
                        : `the ${gameteHTMLLabel(allele1)} allele`;
    return `This ${mouse.sex} can produce ${producedLabel} with ${alleleLabel}.`;
  }

  private getGameteOffspringLabel = (mouse: BackpackMouseType) => {
    const parentLabel = mouse.sex === "female" ? "mother" : "father";
    const producedLabel = mouse.sex === "female" ? "eggs" : "sperm";
    return `For the selected litter, these were the ${producedLabel} that came from the ${parentLabel}.`;
  }
}
