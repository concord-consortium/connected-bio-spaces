import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";
import { BackpackMouseType, InspectContext } from "../models/backpack-mouse";
import { StackedOrganism } from "./stacked-organism";
import { speciesDef, units } from "../models/units";
import "./inspect-panel.sass";
import "./inspect-panel.pea.sass";

export type OrganismInfoProvider =
  (org: BackpackMouseType, context: InspectContext, isGamete: boolean, showGenotype: boolean) => JSX.Element;
export type InspectFooterInfoProvider =
  (context: InspectContext, org1: BackpackMouseType, org2?: BackpackMouseType) => JSX.Element | null;
export interface InspectStrings {
  motherGameteLabel: string;
  fatherGameteLabel: string;
}

interface IProps extends IBaseProps {
  mouse1?: BackpackMouseType;
  mouse2?: BackpackMouseType;
  pairLabel: string;
  pairMeta?: string;
  isOffspring: boolean;
  context: InspectContext;
  showGenotype: boolean;
  showGametes: boolean;
  showParentGenotype: boolean;
}
interface IState {}

export class InspectPanel extends BaseComponent<IProps, IState> {

  public render() {
    const { mouse1, mouse2, pairLabel, pairMeta } = this.props;
    const species = mouse1 && speciesDef(mouse1.species);
    let className = "inspect-panel";
    if (mouse1) {
      className += " " + mouse1.species;
    }
    return(
      <div className={className}>
        {(mouse1 && mouse2) && this.renderInspectedPair(mouse1, mouse2, pairLabel, pairMeta)}
        {(mouse1 && !mouse2) && this.renderInspectedMouse(mouse1)}
        {
          (species && species.inspectFooterProvider && mouse1) &&
          species.inspectFooterProvider(this.props.context, mouse1, mouse2)
        }
      </div>
    );
  }

  private renderInspectedPair(leftMouse: BackpackMouseType, rightMouse: BackpackMouseType,
                              label: string, meta?: string) {
    const flipRight = units[rightMouse.species].breeding.flipRightNestParent;
    return(
      <div>
        <div className="inspect-title">{label}</div>
        <div className={`pair-container pair ${meta || ""}`}>
          <div className="inspect-background" />
          {this.renderMouse(leftMouse, false)}
          {this.renderMouse(rightMouse, flipRight)}
        </div>
      </div>
    );
  }

  private renderInspectedMouse(mouse: BackpackMouseType) {
    const {showGametes, context, isOffspring} = this.props;
    const classModifiers = "single " + (showGametes ? "gamete " : "")
    + context + " "
    + ((showGametes && isOffspring) ? "low " : "")
    + (isOffspring ? "offspring " : "parent ")
    + mouse.sex;
    const containerClass = "pair-container " + classModifiers;
    const bgClass = "inspect-background " + classModifiers;
    const allowFlip = units[mouse.species].breeding.flipRightNestParent;
    const flipImage = allowFlip && context !== "population" && !this.props.isOffspring && mouse.sex === "male";
    return(
      <div className={containerClass}>
        { (this.props.showGametes && this.props.isOffspring) && this.renderGametePanel(mouse) }
        <div className={bgClass} />
        {this.renderMouse(mouse, flipImage)}
      </div>
    );
  }

  private renderMouse(mouse: BackpackMouseType, flip: boolean) {
    const mouseImage = mouse.getInspectImage(this.props.context);
    const showSex = units[mouse.species].species.showSexStack;
    const showHetero = this.props.showGenotype;
    return (
      <div className="mouse-container">
        <StackedOrganism
          organism={mouse}
          organismImages={[mouseImage]}
          height={170}
          showSelection={false}
          showSex={showSex}
          showHetero={showHetero}
          flipped={flip}
        />
        {this.renderOrganismInfo(mouse)}
      </div>
    );
  }

  private renderOrganismInfo(org: BackpackMouseType) {
    const species = speciesDef(org.species);
    const context = this.props.context;

    return species.inspectInfoProvider(org, context, this.props.showGametes, this.props.showGenotype);
  }

  private renderGametePanel = (mouse: BackpackMouseType) => {
    const species = speciesDef(mouse.species);
    const unitBreeding = units[mouse.species].breeding;
    const arrowImage = "assets/unit/mouse/breeding/inspect/inspect-arrow.png";
    const label1 = this.props.showParentGenotype ? mouse.genotype.slice(0, 1) : undefined;
    const label2 = this.props.showParentGenotype ? mouse.genotype.slice(-1) : undefined;
    const motherGamete = (
      <div className="gamete-panel-container">
        <div className="gamete-panel-title">{species.inspectStrings.motherGameteLabel}</div>
        { renderGameteIcon(mouse, "female", label1) }
      </div>
    );
    const fatherGamete = (
      <div className="gamete-panel-container">
        <div className="gamete-panel-title">{species.inspectStrings.fatherGameteLabel}</div>
        { renderGameteIcon(mouse, "male", label2) }
      </div>
    );
    const leftGamete = unitBreeding.showMaleOnLeft ? fatherGamete : motherGamete;
    const rightGamete = unitBreeding.showMaleOnLeft ? motherGamete : fatherGamete;
    return(
      <div className="gamete-panel">
        { leftGamete }
        { rightGamete }
        <img src={arrowImage} className="arrow" />
      </div>
    );
  }
}

export const renderGameteIcons = (mouse: BackpackMouseType) => {
  const label1 = mouse.genotype.slice(0, 1);
  const label2 = mouse.genotype.slice(-1);
  return(
    <div className="gamete-icons">
      { renderGameteIcon(mouse, mouse.sex, label1) }
      { label2 !== label1 && renderGameteIcon(mouse, mouse.sex, label2) }
    </div>
  );
};

export const renderGameteIcon = (mouse: BackpackMouseType, sex: string, label?: string) => {
  const species = speciesDef(mouse.species);
  const iconClass = "gamete-icon " + (sex === "female" ? "egg" : "sperm");
  return(
    <div className="gamete-icon-container">
      <div className={iconClass} />
      { label &&
        <div className="gamete-label" dangerouslySetInnerHTML={{ __html: species.getGameteHTMLLabel(label) }}/>
      }
    </div>
  );
};
