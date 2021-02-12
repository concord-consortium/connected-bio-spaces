import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";
import { BackpackMouseType, InspectContext } from "../models/backpack-mouse";
import { StackedOrganism } from "./stacked-organism";
import { speciesDef, units } from "../models/units";
import "./inspect-panel.sass";
import "./inspect-panel.pea.sass";

export type OrganismInfoProvider =
  (org: BackpackMouseType, context: InspectContext, isGamete: boolean, showGenotype: boolean) => JSX.Element;

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
    const mouseImage = mouse.getInspectImage(this.getContext());
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
        {this.renderOrganismInfo(mouse)}
      </div>
    );
  }

  private renderOrganismInfo(org: BackpackMouseType) {
    const species = speciesDef(org.species);
    const context = this.getContext();

    return species.inspectInfoProvider(org, context, this.props.isGamete, this.props.showGenotype);
  }

  private renderGametePanel = (mouse: BackpackMouseType) => {
    const arrowImage = "assets/unit/mouse/breeding/inspect/inspect-arrow.png";
    const label1 = mouse.genotype.slice(0, 1);
    const label2 = mouse.genotype.slice(-1);
    return(
      <div className="gamete-panel">
        <div className="gamete-panel-container">
          <div className="gamete-panel-title">Egg from mother</div>
          { renderGameteIcon(mouse, "female", label1) }
        </div>
        <div className="gamete-panel-container">
          <div className="gamete-panel-title">Sperm from father</div>
          { renderGameteIcon(mouse, "male", label2) }
        </div>
        <img src={arrowImage} className="arrow" />
      </div>
    );
  }

  private getContext = () => {
    const context: InspectContext =
      this.props.isPopulationInspect ? "population" :
      this.props.mouse2 ? "nest" :
      this.props.isOffspring ? "offspring" : "parent";
    return context;
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

export const renderGameteIcon = (mouse: BackpackMouseType, sex: string, label: string) => {
  const species = speciesDef(mouse.species);
  const iconClass = "gamete-icon " + (sex === "female" ? "egg" : "sperm");
  return(
    <div className="gamete-icon-container">
      <div className={iconClass} />
      <div className="gamete-label" dangerouslySetInnerHTML={{ __html: species.getGameteHTMLLabel(label) }}/>
    </div>
  );
};
